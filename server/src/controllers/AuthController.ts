import type { Request, Response, NextFunction } from 'express';
import { internalError } from '../utils/InternalError.ts';
import jswt from 'jsonwebtoken';
import User from '../models/UserModel.ts';
import bcrypt from 'bcryptjs';
import { validateEmailPassword } from '../utils/validateEmailPassword.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenExpiration = 60 * 60 * 1000 * 2;
const createToken = (email: string, userId: string) => {
  return jswt.sign({ email, userId }, process.env.JWT_KEY!, { expiresIn: tokenExpiration });
};

const deleteOldImage = (filePath: string) => {
  filePath = path.join(__dirname, '..', '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

type BasicType = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type ErrorType = {
  status: number | null;
  password: string | null;
  confirmPassword?: string | null;
  email: string | null;
  messages: string[];
};

export const signup: BasicType = async (req, res, next) => {
  try {
    let { email, password, confirmPassword } = req.body;
    email = email.trim().toLowerCase();
    let isError = false;
    const error: ErrorType = {
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

    if (isError) {
      return res.status(error.status).send({ error });
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      isError = true;
      error.status = 400;
      error.email = 'Email is already in use';
    }

    if (isError) {
      return res.status(error.status).send({ error });
    }

    const user = await User.create({ email, password });

    res.cookie('jwt', createToken(email, user.id), {
      maxAge: tokenExpiration,
      secure: true,
      sameSite: 'none',
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const login: BasicType = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    let isError = false;
    const error: ErrorType = {
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

    if (isError) {
      return res.status(error.status).send({ error });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      isError = true;
      error.status = 400;
      error.email = 'User not found';
    }

    if (isError) {
      return res.status(error.status).send({ error });
    }

    const auth = await bcrypt.compare(password, foundUser.password);
    if (!auth) {
      isError = true;
      error.status = 400;
      error.email = 'Wrong password';
    }
    res.cookie('jwt', createToken(email, foundUser.id), {
      maxAge: tokenExpiration,
      secure: true,
      sameSite: 'none',
    });

    return res.status(201).json({
      user: {
        id: foundUser.id,
        email: foundUser.email,
        profileSetup: foundUser.profileSetup,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        image: foundUser.image,
        color: foundUser.color,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};

export const getUserInfo: BasicType = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).send({ message: 'User with the given id not found' });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};
export const updateUserProfil: BasicType = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    const image = req.file;
    let relativeFilePath;
    if (image) relativeFilePath = path.join('/uploads/profiles', image.filename);

    if (!firstName || !lastName || !color) {
      return res.status(400).send({ message: 'First Name, Last Name, and Color are required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Delete old image if a new one is uploaded
    if (image && user.image) {
      const oldImagePath = path.join(__dirname,'..', '..', user.image);
      fs.unlink(oldImagePath, (err) => console.log(err));
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
      },
    });
  } catch (err) {
    internalError(err, res);
  }
};
