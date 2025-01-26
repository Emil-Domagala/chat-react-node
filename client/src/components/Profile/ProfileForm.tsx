import { useUser } from '../../store/userContext';
import Form from '../UI/Form/Form';
import Input from '../UI/Form/Input';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  //   const handle = () => {};
  // console.log(user);
  return (
    <>
      {/* <Form action={handle}> */}

      <div className={classes['top']}>
        <div className={`${classes['left']}`}>
          <div className={`${classes['circle-avatar']}`}></div>
        </div>
        <div className={`${classes['right']}`}>
          <div className={`${classes['input-wrapper']}`}>
            <Input placeholder="Your Email" square />
          </div>
          <div className={`${classes['input-wrapper']}`}>
            <Input placeholder="First Name" square />
          </div>
          <div className={`${classes['input-wrapper']}`}>
            <Input placeholder="Last Name" square />
          </div>
          <div className={`${classes['input-wrapper-flex']}`}>
            <div className={`${classes['circle']} prof-col-1`} />
            <div className={`${classes['circle']} prof-col-2`} />
            <div className={`${classes['circle']} prof-col-3`} />
            <div className={`${classes['circle']} prof-col-4`} />
          </div>
        </div>
      </div>
      <button className={classes['save-changes']}>Save Changes</button>

      {/* </Form> */}
    </>
  );
};
export default ProfileForm;
