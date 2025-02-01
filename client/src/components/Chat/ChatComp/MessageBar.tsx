import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import SendIconSVG from '../../../assets/Icons/SendIconSVG';
import { useState } from 'react';
import classes from './MessageBar.module.css';
import AddEmojiSVG from '../../../assets/Icons/AddEmojiSVG';
import AddAttachment from '../../../assets/Icons/AddAttachment';
import EmojiPicker from 'emoji-picker-react';
import { useColorMode } from '../../../store/colorModeContext';

const MessaggeBar = () => {
  const { mode } = useColorMode();
  const [messageValue, setMessageValue] = useState<string>('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const toggleEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEmojiPickerOpen((prev) => !prev);
  };

  const closeEmojiPicker = () => {
    if (!emojiPickerOpen) return;
    setEmojiPickerOpen(false);
  };

  return (
    <>
      {emojiPickerOpen && <div onClick={closeEmojiPicker} className={classes['background']} />}
      <div className={classes['message-bar--wrapper']}>
        <div className={classes['textarea-wrapper']}>
          <ReactTextareaAutosize
            onChange={(e) => setMessageValue(() => e.target.value)}
            placeholder="Enter your message"
            minRows={1}
            maxRows={4}
            value={messageValue}
          />
          <div className={classes['textarea-icons']}>
            <button className={classes['svg']}>
              <AddAttachment />
            </button>
            <button className={classes['svg']} onClick={toggleEmojiPicker}>
              <AddEmojiSVG />
            </button>
          </div>
        </div>
        <EmojiPicker
          autoFocusSearch={false}
          theme={mode}
          lazyLoadEmojis={true}
          className={classes['emoji-picker']}
          open={emojiPickerOpen}
          onEmojiClick={(emoji) => setMessageValue((prev) => prev + emoji.emoji)}
        />
        <button className={classes['send-button']}>
          <div className={classes['svg']}>
            <SendIconSVG />
          </div>
        </button>
      </div>
    </>
  );
};

export default MessaggeBar;
