const Event = require('../../models/events');
const User = require('../../models/users');
const { tranformEvent } = require('./common');

module.exports = {
  events: () => {
    return Event.find().then(events => {
      return events.map(event => {
        return tranformEvent(event);
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
      createdEvent = tranformEvent(result);
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
}