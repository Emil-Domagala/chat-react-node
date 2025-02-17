import classes from './NameField.module.css';

const NameField = ({
  groupName,
  firstName,
  lastName,
  email,
}: {
  groupName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}) => {
  return (
    <>
      {groupName ? (
        <p className={classes.nameField}>{groupName}</p>
      ) : firstName ? (
        <p className={classes.nameField}>
          {firstName} {lastName}
        </p>
      ) : (
        <p className={classes.nameField}>{email}</p>
      )}
    </>
  );
};

export default NameField;
