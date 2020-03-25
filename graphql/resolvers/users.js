const bcrypt = require('bcryptjs');
const User = require('../../models/users');

module.exports = {
   createUser: (args) => {
    return User.findOne({ email: args.userInput.email }).then(user => {
      if (user) {
        throw new Error('User exists Already');
      };
      return bcrypt.hash(args.userInput.password, 12)
    }).then(hashedPassword => {
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      return user.save()
    }).then(result => {
      return {
        ...result._doc,
        _id: result._doc._id.toString(),
        password: null
      };
    }).catch(err => {
      throw err;
    })
  }
}