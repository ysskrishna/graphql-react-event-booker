const Event = require('../../models/events');
const User = require('../../models/users');
const { tranformEvent } = require('./common');
const { dateToString } = require('../../helpers/date');

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
  createEvent: (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    return event.save().then(result => {
      createdEvent = tranformEvent(result);
      return User.findById(req.userId);
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