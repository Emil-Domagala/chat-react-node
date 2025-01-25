import classes from './Form.module.css'

function Form({ children, action }) {
  return (
    <form action={action} className={`${classes.form} }`}>
      {children}
    </form>
  );
}

export default Form;
