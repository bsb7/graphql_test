const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  //   this is the part where we define how the obj will look like
  // how should it look like in our app and database
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents:[
      {
          type: Schema.Types.ObjectId,
          ref: 'Event'
      }
  ]
});


module.exports = mongoose.model('User', userSchema);