import { useEffect } from 'react';
import { logoutHTTP } from '../utils/httpAuth';
import { useUser } from '../store/userContext';
import { useChatContext } from '../store/chatContext';

const ErrorPage = () => {
  const { setUser } = useUser();
  const { setContact, setGroup } = useChatContext();

  useEffect(() => {
    const logout = async () => {
      const resData = await logoutHTTP();
      if (resData) return setUser(undefined), setContact(undefined, undefined), setGroup(undefined, undefined);
    };
    logout();
  }, []);

  return (
    <div className="error-500-page">
      <h1>500</h1>
      <h2>Internal Server Error</h2>
      <p>We apologize for inconveinence. Please try again later. </p>
    </div>
  );
};

export default ErrorPage;
