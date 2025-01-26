import type { Request, Response, NextFunction } from 'express';
import { internalError } from '../utils/InternalError.ts';
import jswt from 'jsonwebtoken';
import User from '../models/UserModel.ts';
import bcrypt from 'bcryptjs';
import { validateEmailPassword } from '../utils/validateEmailPassword.ts';

const tokenExpiration = 60 * 60 * 1000 * 2;
const createToken = (email: string, userId: string) => {
  return jswt.sign({ email, userId }, process.env.JWT_KEY!, { expiresIn: tokenExpiration });
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
    email = email.trim().toLowerCase()
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
    email = email.trim().toLowerCase()
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
