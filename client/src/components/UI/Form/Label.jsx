import classes from './Label.module.css';
import classNames from 'classnames'

function Label({ htmlFor, children, size, className}) {
    const labelClasses=classNames(
        classes.label,
        className,
        {
            [classes.small]:size === 'small'
        }

    )

  return (
    <label htmlFor={htmlFor} className={labelClasses}>
      {children}
    </label>
  );
}

export default Label;
