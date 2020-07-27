const mongoose = require('../../../config/mongo')
mongoose.set('useCreateIndex', true)

const schema = new mongoose.Schema({
  name: mongoose.SchemaTypes.String,
  email:mongoose.SchemaTypes.String,
  password:mongoose.SchemaTypes.String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
}, { versionKey: false })

schema.index({ 'name':'text' })

const Auth = mongoose.model('users', schema)

module.exports = Auth