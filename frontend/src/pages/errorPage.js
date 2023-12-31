import { useTranslation } from 'react-i18next';

const Build404 = () => {
  const { t } = useTranslation();
  return (
    <div id="error-page">
      <h1>{t('oops')}</h1>
      <p>{t('sorryError')}</p>
      <p>
        <i>{t('notFound')}</i>
      </p>
    </div>
  );
};

export default Build404;
