const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/events');
const User = require('./models/users');

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

app.use(bodyParser.json());

// const events = [];

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id : ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!       
    }

    type User {
      _id :  ID!
      email : String!
      password: String
    }

    input UserInput {
      email : String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput) : User
    }

    schema { 
      query:RootQuery
      mutation:RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          return { ...event._doc, _id: event.id };
        })
      }).catch(err => {
        throw err;
      });
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString(),
        creator: '5e7a41b8ddb5b929203802a3'
      });

      let createdEvent;

      return event.save().then(result => {
        createdEvent = { ...result._doc, _id: result._doc._id.toString() };
        return User.findById('5e7a41b8ddb5b929203802a3');
      }).then(user => {
        if (!user) {
          throw new Error('User does not exist');
        } 
        user.createdEvents.push(event);
        return user.save();
      }).then(result => {
        return createdEvent;
      }).catch(err => {
        console.log(err);
        throw err;
      })
    },
    createUser: (args) => {
      return User.findOne({ email: args.userInput.email }).then(user => {
        if (user) {
          throw new Error('User exists Already');
        }
        return bcrypt.hash(args.userInput.password, 12)
      }).then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save()
      }).then(result => {
        return { ...result._doc, _id: result._doc._id.toString(), password: null };
      }).catch(err => {
        throw err;
      })
    }
  },
  graphiql: true
}));

app.listen(PORT, () => {
  console.log("Running express server on ", PORT);
});

module.exports = app; // for testing
