const mongoose = require('../../../config/mongo')
mongoose.set('useCreateIndex', true)

const schema = new mongoose.Schema({
  name: mongoose.SchemaTypes.String,
  image:mongoose.SchemaTypes.String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
}, { versionKey: false })

schema.index({ 'name':'text' })

const  topic= mongoose.model('topics', schema)

module.exports = topic