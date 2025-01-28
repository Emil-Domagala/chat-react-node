import classes from './Image.module.css';

type imageType = {
  imageUrl: string;
  contain?: boolean;
  left?: boolean;
};

const Image = ({ imageUrl, contain, left }: imageType) => (
  <div
    className={classes['image']}
    style={{
      backgroundImage: `url('${imageUrl}')`,
      backgroundSize: contain ? 'contain' : 'cover',
      backgroundPosition: left ? 'left' : 'center',
    }}
  />
  // <img className={classes['image']} src={imageUrl} ></img>
);

export default Image;
