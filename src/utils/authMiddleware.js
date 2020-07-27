require('dotenv');
const jwt = require('jsonwebtoken');
const adminAuthSchema = require('../components/adminAuth/adminAuth.schema');
const authSchema= require('../components/auth/auth.schema')
const {
  success,
  errors
} = require('./response');

// authenticate
function authMiddleWare() {
  const methods = {

    //check admin user token
    verifyToken: async (req, res, next) => {
      try {
        let token = req.headers['authorization'];
        token=token.replace('Bearer ',''); //Replace bearer
        if (token === undefined) return res.status(401).json({
          status: 401,
          message: 'Authentication Failed'
        });
        // if token is not present
        if (!token)
        return errors(res, 401);

        let decoded = await jwt.verify(token, process.env.SECRET_KEY);
        let adminData = '';
        adminData = await adminAuthSchema.findOne({
          _id: decoded.id
        });
        adminData.password = undefined;
        adminData['is_user']=false;
        if (adminData) {
          req.user = adminData;
          next();
        } else {
          return errors(res, 401);
        }
      } catch (err) {
          console.log(err)
        if (err.name === 'TokenExpiredError')
          return res.status(401).json({
            status: 401,
            message: 'Your Session has expired, Please Login again.'
          });
        else if (err.name === 'JsonWebTokenError') return res.status(401).json({
          status: 401,
          message: 'Unauthorized Access, Please Login again.'
        });
        else
          return res.status(401).json({
            status: 401,
            message: 'Unauthorized Access, Please Login again.'
          });
      }
    },

    //Public user token verification
    verifyUserToken: async (req, res, next) => {


      try {
        let token = req.headers['authorization'];
        token=token.replace('Bearer ',''); //Replace bearer
        if (token === undefined) return res.status(401).json({
          status: 401,
          message: 'Authentication Failed'
        });


        // if token is not present
        if (!token)
          return errors(res, 401);
        let decoded = await jwt.verify(token, process.env.SECRET_KEY);

        let userData= '';
        userData = await authSchema.findOne({
          _id: decoded.id
        });

        userData.password = undefined;
        userData['is_user']=true;
        if (userData) {
          req.user = userData;
          next();
        } else {
          return errors(res, 401);
        }
      } catch (err) {

        if (err.name === 'TokenExpiredError')
          return res.status(401).json({
            status: 401,
            message: 'Your token has expired, Please Login again.'
          });
        else if (err.name === 'JsonWebTokenError') return res.status(401).json({
          status: 401,
          message: 'Unauthorized Access, Please Login again.'
        });
        else
          return res.status(401).json({
            status: 401,
            message: 'Unauthorized Access, Please Login again.'
          });
      }
    }
  };

  // return Object freeze 
  return Object.freeze(methods);
}

// exporting the modules 
module.exports =authMiddleWare();
