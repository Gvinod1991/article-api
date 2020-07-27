const { validateSignUp,validateLogin
  } = require('../../utils/inputValidation');

function AuthRoutes() {
    const authController= require('./auth.controller');
    return (open, closed, appOpen, appClosed) => {
        //open.route('/auth/users').get(authController.getAllUsers);
        appOpen.route('/signup').post(validateSignUp, authController.signup)
        appOpen.route('/login').post(validateLogin, authController.logIn)
    }
}

module.exports = AuthRoutes();
  