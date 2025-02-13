import { internalError } from '../utils/InternalError.ts';
import jswt from 'jsonwebtoken';
import User from '../models/UserModel.ts';
import bcrypt from 'bcryptjs';
import { validateEmailPassword } from '../utils/validateEmailPassword.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { saveResizedImage } from '../utils/sharp.ts';
import '../../types/types.d.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenExpiration = 60 * 60 * 1000 * 2;
const createToken = (email: string, userId: string) => {
  return jswt.sign({ email, userId }, process.env.JWT_KEY!, { expiresIn: tokenExpiration });
};
const deleteOldImage = (oldFilePath: string) => {
  const filePath = path.join(__dirname, '..', '..', oldFilePath);
  fs.unlink(filePath, (err) => console.log(err));
};
export const signup: ControllerFunctionType = async (req, res, next) => {
  try {
    let { email, password, confirmPassword } = req.body;
    email = email.trim().toLowerCase();
    let isError = false;
    const error: ControllerErrorType = {
      status: null,
      password: null,
      confirmPassword: null,
      email: null,
      messages: [],
    };

    const isValidationSucces = validateEmailPassword(email, password);

    if (Object.keys(isValidationSucces).length > 0) {
      isError = true;
      error.status = 400;
      Object.assign(error, isValidationSucces);
    }

    if (!confirmPassword) {
      isError = true;
      error.status = 400;
      error.confirmPassword = 'Confirm password is required';
    }

    if (password !== confirmPassword) {
      isError = true;
      error.status = 400;
      error.confirmPassword = 'Password and confirm password must match';
    }

    if (isError) return res.status(error.status!).send({ error });

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      isError = true;
      error.status = 400;
      error.email = 'Email is already in use';
    }

    if (isError) return res.status(error.status!).send({ error });

    const user = await User.create({ email, password });

    res.cookie('jwt', createToken(email, user.id), {
      maxAge: tokenExpiration,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({ user: { id: user.id, email: user.email, profileSetup: user.profileSetup } });
  } catch (err) {
    internalError(err, res);
  }
};

export const login: ControllerFunctionType = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    let isError = false;
    const error: ControllerErrorType = {
      status: null,
      password: null,
      email: null,
      messages: [],
    };

    const isValidationSucces = validateEmailPassword(email, password);
    if (Object.keys(isValidationSucces).length > 0) {
      isError = true;
      error.status = 400;
      Object.assign(error, isValidationSucces);
    }

    if (isError) return res.status(error.status!).send({ error });

    const foundUser = await User.findOne({ email })
      .populate('contacts.contactId', 'firstName lastName image color')
      .populate('contacts.chatId', 'lastMessage')
      .populate('groups.chatId', 'lastMessage')
      .populate('groups.groupId', '_id name admin');

    if (!foundUser) {
      isError = true;
      error.status = 400;
      error.email = 'User not found';
    }

    if (isError) return res.status(error.status!).send({ error });

    const auth = await bcrypt.compare(password, foundUser!.password);

    if (!auth) {
      isError = true;
      error.status = 400;
      error.email = 'Wrong password';
    }
    res.cookie('jwt', createToken(email, foundUser!.id), {
      maxAge: tokenExpiration,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({
      user: {
        id: foundUser!.id,
        email: foundUser!.email,
        profileSetup: foundUser!.profileSetup,
        firstName: foundUser!.firstName,
        lastName: foundUser!.lastName,
        image: foundUser!.image,
        color: foundUser!.color,
        contacts: foundUser!.contacts,
        groups: foundUser!.groups,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const getProfileSetup: ControllerFunctionType = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).send({ message: 'User with the given id not found' });

    return res.status(200).json({
      user: {
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const getUserInfo: ControllerFunctionType = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate('contacts.contactId', 'firstName lastName image color')
      .populate('contacts.chatId', 'lastMessage')
      .populate('groups.chatId', 'lastMessage')
      .populate('groups.groupId', '_id name admin');

    console.log(user);

    if (!user) return res.status(404).send({ message: 'User with the given id not found' });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        contacts: user.contacts,
        groups: user.groups,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const updateUserProfil: ControllerFunctionType = async (req, res, next) => {
  try {
    const { userId } = req;
    let { firstName, lastName, color } = req.body;
    const image = req.file;
    let relativeFilePath;
    firstName = firstName.trim();
    lastName = lastName.trim();
    color = Number(color) || 0;

    if (!firstName || !lastName || Number.isNaN(color))
      return res.status(400).send({ message: 'First Name, Last Name, and Color are required' });

    if (![0, 1, 2, 3].includes(color)) {
      return res.status(400).send({ message: 'Color value is not valid' });
    }
    if (lastName.length > 30) return res.status(400).send({ message: 'Last name must be below 30 characters' });
    if (firstName.length > 30) return res.status(400).send({ message: 'First name must be below 30 characters' });
    const user = await User.findById(userId)
      .populate('contacts.contactId', 'firstName lastName image color')
      .populate('contacts.chatId', 'lastMessage')
      .populate('groups.chatId', 'lastMessage')
      .populate('groups.groupId', 'name admin');
    if (!user) return res.status(404).send({ message: 'User not found' });
    if (image && user.image) deleteOldImage(user.image);

    if (image) {
      relativeFilePath = await saveResizedImage(image, userId!, 'profiles', 120, 120);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.color = color;
    if (image) user.image = relativeFilePath;
    user.profileSetup = true;

    await user.save();

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        contacts: user.contacts,
        groups: user.groups,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const logout: ControllerFunctionType = async (req, res, next) => {
  try {
    console.log('object');
    res.cookie('jwt', '', { maxAge: 1, secure: true, sameSite: 'none' });
    res.status(200).send({ message: 'Logout was successfull' });
  } catch (err) {
    internalError(err, res);
  }
};
