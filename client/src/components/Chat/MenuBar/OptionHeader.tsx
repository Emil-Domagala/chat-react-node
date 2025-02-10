import PlusIconSVG from '../../../assets/Icons/PlusSVG';
import classes from './OptionHeader.module.css';

const OptionHeader = ({
  children,
  turnOn,
}: {
  children: React.ReactNode;
  turnOn: React.MouseEventHandler<HTMLElement>;
}) => {
  return (
    <div className={`${classes['option-header']}`}>
      <h2>{children}</h2>
      <div className={`${classes['svg']}`} onClick={turnOn}>
        <PlusIconSVG />
      </div>
    </div>
  );
};

export default OptionHeader;
