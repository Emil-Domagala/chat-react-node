import classes from './NameField.module.css';

const NameField = ({
  groupName,
  firstName,
  lastName,
}: {
  groupName?: string;
  firstName?: string;
  lastName?: string;
}) => {
  return (
    <>
      {groupName ? (
        <p className={classes.nameField}>{groupName}</p>
      ) : (
        <p className={classes.nameField}>
          {firstName} {lastName}
        </p>
      )}
    </>
  );
};

export default NameField;
