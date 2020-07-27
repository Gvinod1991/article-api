const bcrypt= require('bcrypt');

function response() {
    const methods = {
    generateHashPassword: (password)=>{
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      },
    verifyPassword: (password,hashedPassword) =>{
        return bcrypt.compareSync(password, hashedPassword)
      }
    };
  
    return Object.freeze(methods);
  }
  
  // exporting the entire module 
  module.exports = response();
  