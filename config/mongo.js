const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
var mongo = mongoose.connection
mongo.on('error', console.error.bind(console, 'Mongo connection error'))
mongo.once('open', function () {
  console.log('MongoDB connected')
  console.log('Connection String: ',process.env.MONGO_CONNECTION_STRING)
})

module.exports = mongoose