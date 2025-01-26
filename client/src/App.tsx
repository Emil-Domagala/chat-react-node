import './App.css';
import AuthPage from './components/pages/AuthPage';
import { RouterProvider, createBrowserRouter } from 'react-router';
import ProfilePage from './components/pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: '/profile', element: <ProfilePage /> },
      // {
      //   path: '/coach/:id',
      //   element: <CoachDetailPage />,
      //   loader: loadCoach,
      // },
      // {
      //   path: '/join',
      //   element: <BecomeCoachPage />,
      //   loader: checkBecomeCoachLoader,
      // },
      // { path: '/messages', element: <MessagesPage />, loader: loaderMessages },
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
