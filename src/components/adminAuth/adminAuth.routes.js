const {validateLogin
  } = require('../../utils/inputValidation');

function adminAuthRoutes() {
    const adminAuthController= require('./adminAuth.controller');
    return (open, closed, appOpen, appClosed) => {
      open.route('/login').post(validateLogin, adminAuthController.logIn)
    }
}

module.exports = adminAuthRoutes();
  