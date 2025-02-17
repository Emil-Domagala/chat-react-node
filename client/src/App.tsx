import AuthPage from './pages/AuthPage';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router';
import ProfilePage from './pages/ProfilePage';
import { useUser } from './store/userContext';
import ChatPage from './pages/ChatPage';
import Loading from './components/UI/Loading/Loading';
import ErrorPage from './pages/ErrorPage';
import Error404 from './pages/Error404';

const PrivateRoute = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/profile-setup';

  const response = await fetch(FETCH_USER_URL, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw redirect('/');
  }

  return null;
};

const ChatRoute = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/profile-setup';

  const response = await fetch(FETCH_USER_URL, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw redirect('/');
  }

  const user = await response.json();
  if (user.user.profileSetup === false) throw redirect('/profile');

  return null;
};

const AuthRoute = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/profile-setup';

  const response = await fetch(FETCH_USER_URL, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    throw redirect('/chat');
  }

  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthPage />, loader: AuthRoute },
      { path: '/profile', element: <ProfilePage />, loader: PrivateRoute },
      { path: '/chat', element: <ChatPage />, loader: ChatRoute },
      { path: '/*', element: <Error404 /> },
    ],
  },
]);

function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container-full fl-col center">
        <Loading />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
