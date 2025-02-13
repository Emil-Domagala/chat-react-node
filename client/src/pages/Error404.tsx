import { Link } from 'react-router';
import classes from './Error404.module.css';

const Error404 = () => {
  return (
    <div className={classes['page-404']}>
      <h1>Oops!</h1>
      <h2>404 - Page not found</h2>
      <p>The page that you are looking for doesent exist</p>
      <Link to={'/chat'}>TAKE ME FROM HERE</Link>
    </div>
  );
};

export default Error404;
