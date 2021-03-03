const { validateSignUp, validateLogin
} = require('../../utils/inputValidation');

function CustomerRoutes() {
  const customerController = require('./customer.controller');
  return (open, closed, appOpen, appClosed) => {
    appClosed.route('/customers').get(customerController.getAllCustomers);
    appClosed.route('/customer').post(customerController.createCustomer);
    appClosed.route('/customer/:_id').get(customerController.getOneCustomer);
    appClosed.route('/customer/:_id').put(customerController.updateCustomer)
    appClosed.route('/customer/:_id').delete(customerController.deleteCustomer)
  }
}

module.exports = CustomerRoutes();
