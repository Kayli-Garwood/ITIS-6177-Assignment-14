const database = require('../connection/mongo');
const {
  Schema
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = new Schema({
  name: {
    type: String,
    default: ""
  },
  alive: {
    type: Boolean,
    default: false
  },
  age: {
    type: Number,
    default: false
  },
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);
module.exports = database.model("Monkey", schema);