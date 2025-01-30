import classes from './NameField.module.css';

const NameField = ({ firstName, lastName }: { firstName?: string; lastName?: string }) => {
  return (
    <p className={classes.nameField}>
      {firstName} {lastName}
    </p>
  );
};

export default NameField;
