import LoaddingSVG from '../../../assets/Icons/LoaddingSVG';
import classes from './Loading.module.css';

const Loading = () => {
  return (
    <div className={classes.loading}>
      <LoaddingSVG />
    </div>
  );
};

export default Loading;
