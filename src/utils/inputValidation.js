const Joi = require('joi');
//const Extension = require('joi-date-extensions');
//const Joi = BaseJoi.extend(Extension);
//const Joi= BaseJoi;
// generic option
const options = {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
};


//public user signup input validation
exports.validateSignUp = (req, res, next) => {

    let schema = Joi.object().keys({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().trim().label('email').required().max(256),
      password: Joi.string().trim().label('password').required(),
    });
  
    schema.validateAsync(req.body, options).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });
      return res.status(400).json({
        error
      });
    });
};

//public user login input validation
exports.validateLogin = (req, res, next) => {

    let schema = Joi.object().keys({
      email: Joi.string().email().trim().label('email').required().max(256),
      password: Joi.string().trim().label('password').required(),
    });
  
    schema.validateAsync(req.body, options).then(() => {
      next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });
      return res.status(400).json({
        error
      });
    });
};

//public user signup input validation
exports.validateCreateArticle = (req, res, next) => {

  let schema = Joi.object().keys({
    title: Joi.string().min(3).required(),
    content: Joi.string().trim().required(),
    isFeatured:Joi.boolean().required(),
    topic_id:Joi.string().required(),
  });
  //console.log(req);
  schema.validateAsync(req.body, options).then(() => {
    next();
    // if error occured
  }).catch((err) => {
    let error = [];
    err.details.forEach(element => {
      error.push(element.message);
    });
    return res.status(400).json({
      error
    });
  });
};