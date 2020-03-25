const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const jwt = require('jsonwebtoken');

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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('user doesnt exist');
    };
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('password doesnt match');
    };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: `${process.env.JWT_EXPIRATION_TIME}h` }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: process.env.JWT_EXPIRATION_TIME
    }

  }
}