import MoreInfoSvg from '../../../assets/Icons/MoreInfoSVG';
import classes from './Label.module.css';
import classNames from 'classnames';

type LabelType = {
  moreInfo?: string;
  htmlFor: string;
  size?: 'small' | 'medium' | 'big';
  children: React.ReactNode;
  className?: string;
};

function Label({ moreInfo, htmlFor, children, size, className }: LabelType) {
  const labelClasses = classNames(classes.label, className, {
    [classes.small]: size === 'small',
  });

  return (
    <div className={classes['label-container']}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {children}
      </label>
      {moreInfo && (
        <div className={classes['more-info']}>
          <MoreInfoSvg />
          <div className={classes['triangle']}></div>
          <div className={classes['more-info--dialog']}>
            <p>{moreInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Label;
