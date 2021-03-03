const mongoose = require('../../../config/mongo')
mongoose.set('useCreateIndex', true)

const schema = new mongoose.Schema({
  name: mongoose.SchemaTypes.String,
  emailId: mongoose.SchemaTypes.String,
  username: mongoose.SchemaTypes.String,
  phone: mongoose.SchemaTypes.String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false })

schema.index({ 'name': 'text' })

const Customer = mongoose.model('customers', schema)

module.exports = Customer