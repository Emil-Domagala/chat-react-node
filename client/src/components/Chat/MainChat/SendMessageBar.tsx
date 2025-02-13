import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import SendIconSVG from '../../../assets/Icons/SendIconSVG';
import { useState } from 'react';
import classes from './SendMessageBar.module.css';
import AddEmojiSVG from '../../../assets/Icons/AddEmojiSVG';
// import AddAttachment from '../../../assets/Icons/AddAttachment';
import EmojiPicker from 'emoji-picker-react';
import { useColorMode } from '../../../store/colorModeContext';
import { IMessage, useSocket } from '../../../store/socketContext';
import { useChatContext } from '../../../store/chatContext';
import { useUser } from '../../../store/userContext';
import ErrorText from '../../UI/Form/ErrorText';
import { Theme } from 'emoji-picker-react';

const SendMessaggeBar = () => {
  const { mode } = useColorMode();
  const [messageValue, setMessageValue] = useState<string>('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const { sendMessage } = useSocket();
  const { currentChatId } = useChatContext();
  const { user } = useUser();
  const [hasError, setHasError] = useState(false);

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEmojiPickerOpen((prev) => !prev);
  };

  const closeEmojiPicker = () => {
    if (!emojiPickerOpen) return;
    setEmojiPickerOpen(false);
  };

  const handleSendMessage = () => {
    if (messageValue.trim() === '') return;
    if (messageValue.trim().length > 600) return setHasError(true);
    const message = {
      sender: user?.id,
      chatId: currentChatId,
      messageType: 'text',
      content: messageValue.trim(),
    };
    setHasError(false);
    sendMessage(message as IMessage);
    setMessageValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendMessage();
    }
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
            {/* maybe i will add it later, now just couldnt find free dile storage system where i dont need to provide my credit card info */}
            {/* <button className={classes['svg']}>
              <AddAttachment />
            </button> */}
            <button className={classes['svg']} onClick={toggleEmojiPicker}>
              <AddEmojiSVG />
            </button>
          </div>
        </div>
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
