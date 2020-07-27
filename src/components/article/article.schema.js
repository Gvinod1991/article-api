const mongoose = require('../../../config/mongo')
mongoose.set('useCreateIndex', true)

const schema = new mongoose.Schema({
  title: mongoose.SchemaTypes.String,
  content:mongoose.SchemaTypes.String,
  image:mongoose.SchemaTypes.String,
  isFeatured:mongoose.SchemaTypes.Boolean,
  topic_id:mongoose.SchemaTypes.String,
  tags:mongoose.SchemaTypes.Array,
  fetchCount:{type:mongoose.SchemaTypes.Number,default:0},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
},{versionKey: false })

schema.index({ 'name':'text' })

const  article= mongoose.model('articles', schema)

module.exports = article