const basePath = '/api/v1';

export default {
  chatPagePath: () => '/',
  loginPagePath: () => 'login',
  registrationPagePath: () => 'signup',
  loginPath: () => [basePath, 'login'].join('/'),
  dataPath: () => [basePath, 'data'].join('/'),
  regPath: () => [basePath, 'signup'].join('/'),
};
