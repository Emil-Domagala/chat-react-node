import { useActionState, useState } from 'react';
import { useUser } from '../../store/userContext';
import Form from '../UI/Form/Form';
import Input from '../UI/Form/Input';
import classes from './ProfileForm.module.css';
import { colors } from '../../utils/getColors';
import PlusIconSVG from '../Icons/PlusSVG';
import ErrorText from '../UI/Form/ErrorText';
import { updateProfileHandler } from '../../utils/httpAuth';

const ProfileForm = () => {
  const { user, setUser } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [firstNameWasTouched, setFirstNameWasTouched] = useState(false);

  const [lastName, setLastName] = useState(user?.lastName || '');
  const [lastNameWasTouched, setLastNameWasTouched] = useState(false);

  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(user?.color || 0);

  let formIsValid = false;
  const firstNameIsValid = firstName.trim() !== '';
  const firstNameHasError = !firstNameIsValid && firstNameWasTouched;
  const lastNameIsValid = lastName.trim() !== '';
  const lastNameHasError = !lastNameIsValid && lastNameWasTouched;

  if (lastNameIsValid && firstNameIsValid && selectedColor != null) formIsValid = true;

  const submitAction = async () => {
    if (!formIsValid) return;
    const newUser = await updateProfileHandler(firstName, lastName, +selectedColor);
    console.log(newUser);
  };

  const [, action, isPending] = useActionState<void>(submitAction, undefined);
  return (
    <>
      <Form action={action}>
        <div className={classes['top']}>
          <div className={`${classes['left']}`}>
            <div style={{ ...colors[selectedColor] }} className={`${classes['circle-avatar']}`}>
              <input type="file" accept="image/png, image/jpeg, image/jpg" />
              <div className={classes['svg']}>
                <PlusIconSVG />
              </div>
              {image !== null ? (
                <image href="/" />
              ) : firstName != '' ? (
                <p>{firstName.split('')[0]}</p>
              ) : (
                <p>{user?.email.split('')[0]}</p>
              )}
            </div>
          </div>
          <div className={`${classes['right']}`}>
            <div className={`${classes['input-wrapper']}`}>
              <Input placeholder="Your Email" square disabled value={user?.email} required />
            </div>
            <div className={`${classes['input-wrapper']}`}>
              <Input
                onBlur={() => {
                  setFirstNameWasTouched(true);
                }}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="First Name"
                square
                required
              />
              <div className={classes['error-message-container']}>
                <ErrorText errorMessage="This input cannot be empty" hasErrors={firstNameHasError} />
              </div>
            </div>
            <div className={`${classes['input-wrapper']}`}>
              <Input
                onBlur={() => {
                  setLastNameWasTouched(true);
                }}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="Last Name"
                square
                required
              />
              <div className={classes['error-message-container']}>
                <ErrorText errorMessage="This input cannot be empty" hasErrors={lastNameHasError} />
              </div>
            </div>
            <div className={`${classes['input-wrapper-flex']}`}>
              {colors.map((_, index) => {
                return (
                  <input
                    key={index}
                    style={{ ...colors[index] }}
                    type="radio"
                    name="colors"
                    onClick={() => setSelectedColor(index)}
                    value={index}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <button disabled={isPending || !formIsValid} className={classes['save-changes']}>
          Save Changes
        </button>
      </Form>
    </>
  );
};
export default ProfileForm;
