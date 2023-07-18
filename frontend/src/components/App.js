import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/loginPage';
import { BuildPage } from '../pages/chatPage';
import { Build404 } from '../pages/errorPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../contexts/authContext';
import { RegistrationPage } from '../pages/registrationPage';
import { LogOutButton } from './logOutButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  const [loggedIn, setLoggedIn] = useState(!!token);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return <AuthContext.Provider value={{ loggedIn, logIn, logOut, token }}>{children}</AuthContext.Provider>;
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();

  return auth.loggedIn ? children : <LoginPage />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className='d-flex flex-column h-100'>
        <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
          <div className='container'>
            <a className='navbar-brand' href='/'>
              Hexlet Chat
            </a>
            <LogOutButton />
          </div>
        </nav>
        <Routes>
          <Route path='*' element={<Build404 />} />
          <Route
            path='/'
            element={
              <LoginRoute>
                <BuildPage />
              </LoginRoute>
            }
          />
          <Route
            path='login'
            element={
              <LoginRoute>
                <BuildPage />
              </LoginRoute>
            }
          />
          <Route path='signup' element={<RegistrationPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
