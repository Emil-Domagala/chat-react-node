import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
  contacts: [
    {
      contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    },
  ],
  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    },
  ],
});

userSchema.pre('save', async function name(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
