import MoreInfoSvg from '../../../assets/Icons/MoreInfoSVG';
import classes from './Label.module.css';

type LabelType = {
  moreInfo?: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Label({ moreInfo, htmlFor, children }: LabelType) {
  return (
    <div className={classes['label-container']}>
      <label htmlFor={htmlFor} className={classes.label}>
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
