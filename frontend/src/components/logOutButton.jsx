import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AuthContext from '../contexts/authContext';

const LogOutButton = () => {
  const { t } = useTranslation();
  const { logOut } = useContext(AuthContext);
  const openModal = () => {
    logOut();
  };
  return (
    <button type="button" onClick={openModal} className="btn btn-primary">
      {t('logout')}
    </button>
  );
};

export default LogOutButton;
