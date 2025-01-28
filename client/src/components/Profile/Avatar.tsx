import { useRef } from 'react';
import PlusIconSVG from '../Icons/PlusSVG';
import Image from '../UI/Image/Image';
import classes from './Avatar.module.css';

interface CircleAvatarProps {
  firstName: string;
  email: string;
  selectedColor: React.CSSProperties;
  image: string | File | undefined;
  previewImage: string | null; // Preview URL for selected image
  handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({
  firstName,
  email,
  selectedColor,
  image,
  previewImage,
  handleAddImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ ...selectedColor }} className={`${classes['circle-avatar']}`}>
      <input
        ref={inputRef}
        onChange={handleAddImage}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/svg, image/webp"
      />
      <div className={classes['svg']}>
        <PlusIconSVG />
      </div>
      {previewImage ? (
        <Image imageUrl={previewImage} />
      ) : image ? (
        <Image imageUrl={typeof image === 'string' ? image : ''}/>
      ) : firstName !== '' ? (
        <p>{firstName.charAt(0)}</p>
      ) : (
        <p>{email.charAt(0)}</p>
      )}
    </div>
  );
};

export default CircleAvatar;
