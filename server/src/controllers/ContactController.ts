import { createPrivateChat } from '../utils/ChatUtils.ts';
import User from '../models/UserModel.ts';
import Chat from '../models/ChatModel.ts';
import { internalError } from '../utils/InternalError.ts';
import Message from '../models/MessageModel.ts';

export const searchContacts: ControllerFunctionType = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) return res.status(400).send({ message: 'Serch Trem is required' });
    const sanitizedSearchTerm = searchTerm.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const currentUser = await User.findById(req.userId).select('contacts');

    if (!currentUser) return res.status(404).send({ message: 'User not found' });

    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { _id: { $nin: currentUser.contacts } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    const contacts = users.map((item) => ({
      _id: item._id,
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      image: item.image,
      color: item.color,
    }));

    return res.status(200).json({ contacts });
  } catch (err) {
    internalError(err, res);
  }
};

export const addContact: ControllerFunctionType = async (req, res, next) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ message: 'Contact ID is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const contact = await User.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact user not found' });

    if (user.contacts.some((c) => c._id.toString() === contactId)) {
      return res.status(400).json({ message: 'Contact already added' });
    }

    const chat = await createPrivateChat(req.userId, contactId);

    user.contacts.push({ contactId: contact._id, chatId: chat._id });
    contact.contacts.push({ contactId: user._id, chatId: chat._id });

    const newContact = {
      _id: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      chatId: chat._id,
      color: contact.color,
    };

    await Promise.all([user.save(), contact.save()]);

    return res.status(200).json({
      newContact,
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const deleteContact: ControllerFunctionType = async (req, res, next) => {
  try {
    const { deleteContactId, chatId } = req.body;
    if (!deleteContactId || !chatId) return res.status(400).send({ message: 'ContactID and chatId is required' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).send({ message: 'Could not not find user' });
    const contact = await User.findById(deleteContactId);
    if (!contact) return res.status(400).send({ message: 'Could not not find contact user' });
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      console.log('Chat not found');
    }

    const contactData = user.contacts.find((c) => c.contactId.toString() === deleteContactId.toString());
    if (!contactData) return res.status(400).json({ message: 'Contact relationship not found' });

    await Message.deleteMany({ chatId });

    await Promise.all([
      user.updateOne({ $pull: { contacts: { contactId: deleteContactId, chatId } } }),
      contact.updateOne({ $pull: { contacts: { contactId: user._id, chatId } } }),
    ]);

    return res.status(200).json({ message: 'Success', deletedUserId: contact._id });
  } catch (err) {
    internalError(err, res);
  }
};
