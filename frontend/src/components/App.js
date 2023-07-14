import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/loginPage';
import { BuildPage } from '../pages/chatPage';
import { Build404 } from '../pages/errorPage';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../contexts/authContext';

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

  return auth.loggedIn ? children : <Navigate to='/login' />;
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
          </div>
        </nav>
        <div className='container-fluid h-100'>
          <div className='row justify-content-center align-content-center h-100'>
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
              <Route path='login' element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
