import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export const Build404 = () => (
  <div id='error-page'>
    <h1>Oops!</h1>
    <p>Sorry, an unexpected error has occurred.</p>
    <p>
      <i>Not Found</i>
    </p>
  </div>
);

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Минимум 6 символов').max(20, 'Максимум 20 символов').required('Обязательное поле'),
  email: Yup.string().email('Неверный email').required('Обязательное поле'),
});

export const BuildPage = () => (
  <div className='col-12 col-md-8 col-xxl-6'>
    <h1 className='text-center mb-4'>Войти</h1>
    <div className='card shadow-sm'>
      <div className='card-body row p-5'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className='col-12 col-md-6 mt-3 mt-mb-0'>
              <div className='form-floating mb-3'>
                <Field className='form-control' type='email' name='email' placeholder='Ваш Ник' />
                <ErrorMessage name='email' component='div' />
              </div>
              <div className='form-floating mb-3'>
                <Field className='form-control' type='password' name='password' placeholder='Пароль' />
                <ErrorMessage name='password' component='div' />
              </div>
              <div className='form-floating mb-3'>
                <button className='w-100 mb-3 btn btn-outline-primary' type='submit' disabled={isSubmitting}>
                  Войти
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div class='card-footer p-4'>
        <div class='text-center'>
          <span>Нет аккаунта?</span> <a href='/signup'>Регистрация</a>
        </div>
      </div>
    </div>
  </div>
);
