import { useActionState, useState } from 'react';
import { useUser } from '../../store/userContext';
import Form from '../UI/Form/Form';
import Input from '../UI/Form/Input';
import classes from './ProfileForm.module.css';
import { colors } from '../../utils/getColors';
import ErrorText from '../UI/Form/ErrorText';
import { updateProfileHandler } from '../../utils/httpAuth';
import UserImage from './UserImage';
import { useNavigate } from 'react-router';

const ProfileForm = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [firstNameWasTouched, setFirstNameWasTouched] = useState(false);

  const [lastName, setLastName] = useState(user?.lastName || '');
  const [lastNameWasTouched, setLastNameWasTouched] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined | File>(user?.image || undefined);
  const [selectedColor, setSelectedColor] = useState(user?.color || 0);

  let formIsValid = false;
  const firstNameIsValid = firstName.trim() !== '' && firstName.trim().length < 30;
  const firstNameHasError = !firstNameIsValid && firstNameWasTouched;
  const lastNameIsValid = lastName.trim() !== '' && lastName.trim().length < 30;
  const lastNameHasError = !lastNameIsValid && lastNameWasTouched;

  if (lastNameIsValid && firstNameIsValid && selectedColor != null) formIsValid = true;

  const submitAction = async () => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('color', selectedColor.toString());
    if (image) formData.append('image', image);
    if (!formIsValid) return;
    const resData = await updateProfileHandler(formData);

    setUser(resData.user);
    navigate('/chat');
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const [, action, isPending] = useActionState<void>(submitAction, undefined);

  return (
    <>
      <Form action={action}>
        <div className={classes['top']}>
          <div className={`${classes['left']}`}>
            <UserImage
              firstName={firstName}
              email={user?.email || ''}
              selectedColor={selectedColor}
              imagePath={user?.image}
              previewImage={previewImage}
              handleAddImage={handleAddImage}
            />
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
                <ErrorText
                  errorMessage="This input cannot be empty and must be below 30 characters"
                  hasErrors={firstNameHasError}
                />
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
                <ErrorText
                  errorMessage="This input cannot be empty and must be below 30 characters"
                  hasErrors={lastNameHasError}
                />
              </div>
            </div>
            <div className={`${classes['input-wrapper-flex']}`}>
              {colors.map((_, index) => {
                return (
                  <input
                  className={classes['input-radio']}
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
