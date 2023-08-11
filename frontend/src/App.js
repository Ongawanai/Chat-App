import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/loginPage';
import ChatPage from './pages/chatPage';
import Build404 from './pages/errorPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationPage from './pages/registrationPage';
import LogOutButton from './components/logOutButton';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './contexts/authContext';
import useAuth from './hooks';
import routes from './routes.js';

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  const [loggedIn, setLoggedIn] = useState(!!token);
  const logIn = (newToken, username) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', username);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        logIn,
        logOut,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();
  return auth.loggedIn ? children : <LoginPage />;
};

const RegistrationRoute = ({ children }) => {
  const auth = useAuth();
  return auth.loggedIn ? children : <RegistrationPage />;
};

const ShowButton = () => {
  const auth = useAuth();
  return auth.loggedIn && <LogOutButton />;
};
const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('headerText')}
              </a>
              <ShowButton />
            </div>
          </nav>
          <Routes>
            <Route path="*" element={<Build404 />} />
            <Route
              path={routes.chatPagePath()}
              element={(
                <LoginRoute>
                  <ChatPage />
                </LoginRoute>
              )}
            />
            <Route
              path={routes.loginPagePath()}
              element={(
                <LoginRoute>
                  <ChatPage />
                </LoginRoute>
              )}
            />
            <Route
              path={routes.registrationPagePath()}
              element={(
                <RegistrationRoute>
                  <ChatPage />
                </RegistrationRoute>
              )}
            />
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
