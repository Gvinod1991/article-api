const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const glob = require('glob');
const cors = require('cors');
const authMiddleware = require('./src/utils/authMiddleware');
const cookieParser = require('cookie-parser');
const path=require('path')

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

// Connect to Mongo
require('./config/mongo')

// enable proxy server 
app.enable('trust proxy');
/* Protecting headers */
app.use(helmet());
/* Body parser config */

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(
  bodyParser.json({
    verify: rawBodySaver,
    limit: '50mb'
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);

/* CORS setup */
//const domain = 'https://domain.com';
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* *.name.domain for production  */
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app.use(cors());

/* Router setup */
const apiOpenRouter = express.Router(); // Open routes
const apiClosedRouter = express.Router(); // Protected routes
const appOpenRouter = express.Router(); // Open router for app [public user]
const appClosedRouter = express.Router(); // Open router for app [logged in]

apiClosedRouter.use(authMiddleware.verifyToken);
appClosedRouter.use(authMiddleware.verifyUserToken);

/* Fetch router files and apply them to our routers */
glob('./src/components/*', null, (err, files) => {
  files.forEach(component => {
    if (require(component).routes) require(component).routes(
      apiOpenRouter,
      apiClosedRouter,
      appOpenRouter,
      appClosedRouter
    );
  });
});

app.get('/',(req,res)=>{
  res.send("Api working fine");
});
app.get('/users',(req,res)=>{
  res.send("Users Api working fine");
});
// Admin Panel Routes
app.use('/v1', apiOpenRouter);
app.use('/api/v1', apiClosedRouter);

// // App Routes 
app.use('/web/v1', appOpenRouter);
app.use('/web/api/v1', appClosedRouter);

app.use('/public',express.static(path.join(__dirname, 'public')));
// exporting the module 
module.exports = app;
