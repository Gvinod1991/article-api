const jwt=require('jsonwebtoken');
const AdminAuthSchema = require('./adminAuth.schema');
const { success, errors } = require('../../utils').response
const { generateHashPassword, verifyPassword } = require('../../utils').passwordValidation
const expiresIn='24h' // 300 seconds || 5 minutes
function adminAuthController() {
    const methods = {
      logIn: async (req, res) => {
            try {

                // check for the user 
                const checkUser = await AdminAuthSchema.findOne({
                  email: req.body.email.trim().toLowerCase(),
                });
        
                // check the user 
                if (checkUser ) {
                  const passwordValid = await verifyPassword(req.body.password,checkUser.password);
        
                  // check if the password is valid
                  if (passwordValid) {

                    // creating a new jwt token 
                    const tokenData = {
                      id: checkUser.id
                    };
        
                    // generating a new jwt token
                    let token = jwt.sign(tokenData, process.env.SECRET_KEY, {
                      expiresIn: expiresIn
                    });
        
                    // success 
                    return success(res, 200, {
                      token: token
                    }, 'Logged in successfully');
                  } else {
                    // returning error response 
                    return errors(res, 400, 'Invalid credentials');
                  }
                  // user not found 
                } else {
                  return errors(res, 300, 'Invalid credentials');
                }
                // catch any runtime error   
              } catch (e) {
                  console.log(e)
                return errors(res, 500, e);
              }
        }
    }
    return Object.freeze(methods);    
}

module.exports = adminAuthController();
