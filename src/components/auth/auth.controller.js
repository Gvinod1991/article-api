const jwt=require('jsonwebtoken');
const AuthSchema = require('./auth.schema');
const { success, errors } = require('../../utils').response
const { generateHashPassword, verifyPassword } = require('../../utils').passwordValidation
const expiresIn=300 // 300 seconds || 5 minutes
function authController() {
    const methods = {
        getAllUsers: async (req, res) => {
            try {
                let users = await AuthSchema.find();
                if(!users) {
                    return errors(res, 400, "User not found");
                } 
                return success(res, 200, {users}, "success");
            } catch (e) {
            console.log(e)
            return errors(res, 500, e);
            }
        },
        
    //user signup
    signup: async (req, res) => {
        try {
            let checkUser = await AuthSchema.findOne({'email':req.body.email.trim().toLowerCase()})
            //user exist
            if (checkUser) {
                return errors(res, 300, "Email exist");
            }
            // user create 
            else {
                req.body.password=generateHashPassword(req.body.password);
                await AuthSchema.create(req.body);
            }
            return success(res, 200, {
                message: "Sign up successful"
            })
        } catch (e) {
            console.log(e)
          return errors(res, 500, e)
        }
      },
      logIn: async (req, res) => {
            try {

                // check for the user 
                const checkUser = await AuthSchema.findOne({
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
                      token: token,
                      name:checkUser.name
                    }, 'Logged in successfully');
                  } else {
                    // returning error response 
                    return errors(res, 400, 'Invalid Password');
                  }
                  // user not found 
                } else {
                  return errors(res, 300, 'User Not Found');
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

module.exports = authController();
