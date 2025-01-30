import classes from './Form.module.css';

function Form({ children, action }: { children: React.ReactNode; action?: () => void }) {
  return (
    <form action={action} className={`${classes.form} }`}>
      {children}
    </form>
  );
}

export default Form;
