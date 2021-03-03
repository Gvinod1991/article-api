const jwt = require('jsonwebtoken');
const CustomerSchema = require('./customer.schema');
const { success, errors } = require('../../utils').response;

function customerController() {
  const methods = {
    getAllCustomers: async (req, res) => {
      try {
        let customers = await CustomerSchema.find();
        if (!customers) {
          return errors(res, 400, "User not found");
        }
        return success(res, 200, { customers }, "success");
      } catch (e) {
        console.log(e)
        return errors(res, 500, e);
      }
    },

    // Create user 
    createCustomer: async (req, res) => {
      try {
        let checkUser = await CustomerSchema.findOne({ 'emailId': req.body.emailId.trim().toLowerCase() })
        //user exist
        if (checkUser) {
          return errors(res, 300, "Email exist");
        }
        // user create 
        else {
          await CustomerSchema.create(req.body);
        }
        return success(res, 200, {
          message: "Create customer successful"
        })
      } catch (e) {
        console.log(e)
        return errors(res, 500, e)
      }
    },
    updateCustomer: async (req, res) => {
      let _id = typeof (req.params._id) === 'string' && req.params._id.length === 24 ? req.params._id : false;
      if (!_id) {
        return errors(res, 400, "id path param is missing");
      }
      try {
        await CustomerSchema.update(req.body).where({ _id: _id })
        return success(res, 200, {
          message: "Customer details updated successfully"
        });
      }
      catch (err) {
        return errors(res, 500, err)
      }
    },
    deleteCustomer: async (req, res) => {
      //Input validation
      let _id = typeof (req.params._id) === 'string' && req.params._id.length === 24 ? req.params._id : false;
      if (!_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Customer id is required',
        });
      }
      if (_id) {
        CustomerSchema.findOneAndDelete({ "_id": _id }, (err, result) => {
          if (err) {
            return res.status(500).json({
              status: 'error',
              message: 'Internal server error',
            });
          }
          return success(res, 200, {
            message: "Customer details deleted successfully"
          });
        })
      }
    }
  }
  return Object.freeze(methods);
}

module.exports = customerController();
