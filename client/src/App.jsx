import './App.css';
import AuthPage from './components/pages/AuthPage';

function App() {
  const getPreferredColorScheme = () => {
    const body = document.querySelector('body');

    if (window.matchMedia && !localStorage.getItem('color-mode')) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('color-mode', 'dark');
        localStorage.setItem('color-mode', 'dark');
      } else {
        body.setAttribute('color-mode', 'dark');
        localStorage.setItem('color-mode', 'light');
      }
    } else if (localStorage.getItem('color-mode')) {
      body.setAttribute('color-mode', localStorage.getItem('color-mode'));
    }
  };

  getPreferredColorScheme();
  return (
    <>
      <AuthPage />
    </>
  );
}

export default App;
