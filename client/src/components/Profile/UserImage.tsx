import { useRef } from 'react';
import PlusIconSVG from '../../assets/Icons/PlusSVG';
import classes from './UserImage.module.css';
import Avatar from '../UI/Avatar/Avatar';

interface UserImageProps {
  firstName: string;
  email: string;
  selectedColor: number;
  imagePath: string | undefined;
  previewImage: string | null; 
  handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserImage: React.FC<UserImageProps> = ({
  firstName,
  email,
  selectedColor,
  imagePath,
  previewImage,
  handleAddImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`${classes['avatar--wrapper']}`}>
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
        <Avatar fontSize={6} userColor={+selectedColor} imageUrl={previewImage} />
      ) : (
        <Avatar fontSize={6} email={email} firstName={firstName} userColor={+selectedColor} imageUrl={imagePath} />
      )}
    </div>
  );
};

export default UserImage;
