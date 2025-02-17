import mongoose from 'mongoose';

export type IMessage = {
  sender: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  messageType: 'text' | 'image';
  content?: string;
  imageUrl?: string;
};
const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    messageType: { type: String, enum: ['text', 'image'], required: true },
    content: {
      type: String,
      required: function () {
        return this.messageType === 'text';
      },
    },
    imageUrl: {
      type: String,
      required: function () {
        return this.messageType === 'image';
      },
    },
  },
  { timestamps: true },
);
const Message = mongoose.model('Message', messageSchema);
export default Message;