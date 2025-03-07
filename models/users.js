const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref:'Event'
    }
  ]
}, {
  timestamps: true,
  strict: true
});

module.exports = mongoose.model('User', userSchema);