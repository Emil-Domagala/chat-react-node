import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { senderID: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chatId: { chatID: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
