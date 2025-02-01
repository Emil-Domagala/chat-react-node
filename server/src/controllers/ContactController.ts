import User from '../models/UserModel.ts';
import { internalError } from '../utils/InternalError.ts';

export const searchContacts: ControllerFunctionType = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) return res.status(400).send({ message: 'Serch Trem is required' });
    const sanitizedSearchTerm = searchTerm.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
    const regex = new RegExp(sanitizedSearchTerm, 'i');
    const users = await User.find({
      $and: [{ _id: { $ne: req.userId } }, { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }],
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
    console.log('addContact');

    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ message: 'Contact ID is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const contact = await User.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact user not found' });

    if (user.contacts.some((c) => c._id.toString() === contactId)) {
      return res.status(400).json({ message: 'Contact already added' });
    }

    user.contacts.push(contactId);
    contact.contacts.push(user._id);

    const newContact = {
      _id: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
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
    const { deleteContactId } = req.body;
    if (!deleteContactId) return res.status(400).send({ message: 'ContactID is required' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).send({ message: 'Could not not find user' });
    const contact = await User.findById(deleteContactId);
    if (!contact) return res.status(400).send({ message: 'Could not not find contact user' });

    user.contacts = user.contacts.filter((contactId) => contactId.toString() !== deleteContactId.toString());
    contact.contacts = user.contacts.filter((contactId) => contactId.toString() !== req.userId.toString());

    await Promise.all([user.save(), contact.save()]);

    return res.status(200).json({ message: 'Success', deletedUserId: contact._id });
  } catch (err) {
    internalError(err, res);
  }
};
