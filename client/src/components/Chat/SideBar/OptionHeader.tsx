import PlusIconSVG from '../../../assets/Icons/PlusSVG';
import classes from './OptionHeader.module.css';

const OptionHeader = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLElement>;
}) => {
  return (
    <div className={`${classes['option-header']}`}>
      <h2>{children}</h2>
      <div className={`${classes['svg']}`} onClick={onClick}>
        <PlusIconSVG />
      </div>
    </div>
  );
};

export default OptionHeader;
