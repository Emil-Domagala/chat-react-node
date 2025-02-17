// import User from '../models/UserModel.ts';
// import Chat from '../models/ChatModel.ts';
import { internalError } from '../utils/InternalError.ts';
import Message from '../models/MessageModel.ts';
import { saveResizedImage } from '../utils/sharp.ts';
import { sendMessage } from '../socket/socket.ts';

export const getMessages: ControllerFunctionType = async (req, res, _next) => {
  try {
    const { chatId, page = 1, limit = 50 } = req.query;
    if (!chatId) return res.status(400).json({ message: 'Chat ID is required' });

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('sender', 'id firstName lastName color image');
    let nextPage: number | null = 1;

    if (messages.length < +limit) {
      nextPage = null;
    } else {
      nextPage += 1;
    }

    return res.json({ messages, nextPage });
  } catch (err) {
    internalError(err, res);
  }
};
export const uploadFile: ControllerFunctionType = async (req, res, _next) => {
  try {
    const { userId } = req;
    const message = JSON.parse(req.body.message);
    const image = req.file;
    if (!image) return res.status(404).send({ message: 'Image is required' });

    const imageUrl = await saveResizedImage(image, userId!, 700);

    message.imageUrl = imageUrl;

    await sendMessage(message);

    return res.json({ message: 'succes' });
  } catch (err) {
    internalError(err, res);
  }
};
