import { createPrivateChat } from '../utils/ChatUtils.ts';
import User from '../models/UserModel.ts';
import Chat from '../models/ChatModel.ts';
import { internalError } from '../utils/InternalError.ts';
import Message from '../models/MessageModel.ts';
import { notifyContactDeletion, notifyContactAdded } from '../socket/socket.ts';

export const searchContacts: ControllerFunctionType = async (req, res, _next) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) return res.status(400).send({ message: 'Serch Trem is required' });
    const sanitizedSearchTerm = searchTerm.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const currentUser = await User.findById(req.userId).select('contacts');

    if (!currentUser) return res.status(404).send({ message: 'User not found' });

    const userContacts = currentUser.contacts?.map((contact) => contact.contactId.toString()) || [];

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { _id: { $nin: userContacts } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    }).select('_id email firstName lastName image color');

    return res.status(200).json({ contacts });
  } catch (err) {
    internalError(err, res);
  }
};

export const addContact: ControllerFunctionType = async (req, res, _next) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ message: 'Contact ID is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const contact = await User.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact user not found' });

    if (user.contacts.some((c) => c.contactId.toString() === contactId)) {
      return res.status(400).json({ message: 'Contact already added' });
    }

    const chat = await createPrivateChat(req.userId!, contactId);

    await Promise.all([
      user.updateOne({ $push: { contacts: { contactId: contact._id, chatId: chat._id } } }),
      contact.updateOne({ $push: { contacts: { contactId: user._id, chatId: chat._id } } }),
    ]);

    const newContact = {
      _id: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      chatId: chat._id,
      color: contact.color,
      image: contact.image,
    };

    notifyContactAdded(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        chatId: chat._id,
        color: user.color,
        image: user.image,
      },
      contact._id.toString(),
    );

    return res.status(200).json({
      newContact,
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const deleteContact: ControllerFunctionType = async (req, res, _next) => {
  try {
    const { deleteContactId, chatId } = req.body;
    if (!deleteContactId || !chatId) return res.status(400).send({ message: 'ContactID and chatId is required' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).send({ message: 'Could not not find user' });
    const contact = await User.findById(deleteContactId);
    if (!contact) return res.status(400).send({ message: 'Could not not find contact user' });
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) return res.status(400).send({ message: 'Chat not found' });

    const contactData = user.contacts.find((c) => c.contactId.toString() === deleteContactId.toString());
    if (!contactData) return res.status(400).json({ message: 'Contact relationship not found' });

    await Message.deleteMany({ chatId });

    await Promise.all([
      user.updateOne({ $pull: { contacts: { contactId: deleteContactId, chatId } } }),
      contact.updateOne({ $pull: { contacts: { contactId: user._id, chatId } } }),
    ]);

    notifyContactDeletion(user._id.toString(), deleteContactId.toString(), chat._id.toHexString());

    return res.status(200).json({ message: 'Success', deletedUserId: contact._id });
  } catch (err) {
    internalError(err, res);
  }
};
