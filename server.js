require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('./app');

if (process.env.NODE_ENV === 'development') {
    app.listen(port, () => {
        console.log(`Process ${process.pid} is listening to all incoming requests at: ${port}`);
    });
} 
else {
    app.listen(port);
    //Later logger can be called here for debugging using logs
}