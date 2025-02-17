import { IMessage } from '../store/socketContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const messagePath = import.meta.env.VITE_MESSAGE_BASE_PATH;
const SEND_MESSAGE_WITH_IMG_ROUTE = serverUrl + messagePath + '/upload-file';

export const sendMessageWithImgHTTP = async (message: IMessage, image: File) => {
  const formData = new FormData();
  formData.append('image', image); // Append the file
  formData.append('message', JSON.stringify(message));

  const response = await fetch(SEND_MESSAGE_WITH_IMG_ROUTE, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || 'Sending message failed') as Error & { errorData?: object };
    error.errorData = resData;
    throw error;
  }
  return resData;
};
