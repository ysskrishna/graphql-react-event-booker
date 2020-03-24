const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/events');

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

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema { 
      query:RootQuery
      mutation:RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(events =>{
        return events.map(event =>{
          return {...event._doc, _id:event.id};
        })
      }).catch(err =>{
        throw err;
      });
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString()
      });

      return event.save().then(result =>{
        console.log(result);
        return {...result._doc, _id:result._doc._id.toString()};
      }).catch(err =>{
        console.log(err);
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
