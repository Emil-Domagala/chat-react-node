import './App.css';
import AuthPage from './components/pages/AuthPage';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router';
import ProfilePage from './components/pages/ProfilePage';
import { useUser } from './store/userContext';
import ChatPage from './components/pages/ChatPage';

const PrivateRoute = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/user-info';

  const response = await fetch(FETCH_USER_URL, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw redirect('/');
  }

  const user = await response.json();

  return { user };
};

const AuthRoute = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const authPath = import.meta.env.VITE_AUTH_BASE_PATH;
  const FETCH_USER_URL = serverUrl + authPath + '/user-info';

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
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthPage />, loader: AuthRoute },
      { path: '/profile', element: <ProfilePage />, loader: PrivateRoute },
      { path: '/chat', element: <ChatPage />, loader: PrivateRoute },
    ],
  },
  // { path: '/error', element: <ErrorPage /> },
  // {
  //   path: 'auth',
  //   element: <AuthPage />,
  //   loader: checkAuthLoader,
  // },
]);

function App() {
  const { user } = useUser();
  console.log(user);
  const getPreferredColorScheme = () => {
    const body = document.querySelector('body');

    if (window.matchMedia && !localStorage.getItem('color-mode')) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body!.setAttribute('color-mode', 'dark');
        localStorage.setItem('color-mode', 'dark');
      } else {
        body!.setAttribute('color-mode', 'dark');
        localStorage.setItem('color-mode', 'light');
      }
    } else if (localStorage.getItem('color-mode')) {
      body!.setAttribute('color-mode', localStorage.getItem('color-mode')!);
    }
  };

  getPreferredColorScheme();
  return <RouterProvider router={router} />;
}

export default App;
