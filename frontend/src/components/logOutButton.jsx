import { useContext } from 'react';
import AuthContext from '../contexts/authContext';

export const LogOutButton = () => {
  const { logOut } = useContext(AuthContext);
  const openModal = () => {
    logOut();
  };
  return (
    <button type='button' onClick={openModal} className='btn btn-primary'>
      Выйти
    </button>
  );
};
