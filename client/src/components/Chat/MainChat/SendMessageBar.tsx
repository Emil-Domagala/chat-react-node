import ReactTextareaAutosize from 'react-textarea-autosize';
import SendIconSVG from '../../../assets/Icons/SendIconSVG';
import { useState, useRef } from 'react';
import classes from './SendMessageBar.module.css';
import AddEmojiSVG from '../../../assets/Icons/AddEmojiSVG';
import EmojiPicker from 'emoji-picker-react';
import { useColorMode } from '../../../store/colorModeContext';
import { IMessage, useSocket } from '../../../store/socketContext';
import { useChatContext } from '../../../store/chatContext';
import { useUser } from '../../../store/userContext';
import ErrorText from '../../UI/Form/ErrorText';
import { Theme } from 'emoji-picker-react';
import AddPhotoSVG from '../../../assets/Icons/AddPhotoSVG';
import { sendMessageWithImgHTTP } from '../../../utils/httpMessageWithImg';

const SendMessaggeBar = () => {
  const { mode } = useColorMode();
  const [messageValue, setMessageValue] = useState<string>('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const { sendMessage } = useSocket();
  const { currentChatId } = useChatContext();
  const { user } = useUser();
  const [hasError, setHasError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<undefined | File>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEmojiPickerOpen((prev) => !prev);
  };

  const closeEmojiPicker = () => {
    if (!emojiPickerOpen) return;
    setEmojiPickerOpen(false);
  };

  const handleSendMessage = async () => {
    const trimedMessageVal = messageValue.trim();
    if (trimedMessageVal.length > 600) return setHasError(true);
    const message: IMessage = {
      sender: user!.id,
      chatId: currentChatId!,
      messageType: 'text',
      content: trimedMessageVal,
    };

    if (image) {
      message.messageType = 'image';
      sendMessageWithImgHTTP(message, image);
    }

    if (!image) {
      if (trimedMessageVal === '') return;
      sendMessage(message as IMessage);
    }
    setImage(undefined);
    setPreviewImage(undefined);
    setHasError(false);
    setMessageValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendMessage();
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <>
      {emojiPickerOpen && <div onClick={closeEmojiPicker} className={classes['background']} />}

      <div className={classes['message-bar--wrapper']}>
        <div className={classes['error-text-wrapper']}>
          <ErrorText errorMessage="Message must be below 600 characters" hasErrors={hasError} />
        </div>
        <div className={classes['textarea-wrapper']}>
          <ReactTextareaAutosize
            onKeyUpCapture={handleKeyDown}
            onChange={(e) => setMessageValue(() => e.target.value)}
            placeholder="Enter your message"
            minRows={1}
            maxRows={4}
            value={messageValue}
          />
          <div className={classes['textarea-icons']}>
            <button onClick={openFileInput} className={classes['svg']}>
              <AddPhotoSVG />
              <input
                onChange={handleAddImage}
                ref={fileInputRef}
                className={classes.hidden}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg, image/webp"
              />
            </button>
            <button className={classes['svg']} onClick={toggleEmojiPicker}>
              <AddEmojiSVG />
            </button>
          </div>
        </div>
        {previewImage && (
          <div className={classes['img-wrapper']}>
            <img className={classes['prev-img']} src={previewImage} />
          </div>
        )}
        <EmojiPicker
          autoFocusSearch={false}
          theme={mode as Theme}
          lazyLoadEmojis={true}
          className={classes['emoji-picker']}
          open={emojiPickerOpen}
          onEmojiClick={(emoji) => setMessageValue((prev) => prev + emoji.emoji)}
        />
        <button onClick={handleSendMessage} className={classes['send-button']}>
          <div className={classes['svg']}>
            <SendIconSVG />
          </div>
        </button>
      </div>
    </>
  );
};

export default SendMessaggeBar;
