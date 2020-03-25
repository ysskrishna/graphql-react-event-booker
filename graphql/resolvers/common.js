const User = require('../../models/users');
const Event = require('../../models/events');
const { dateToString } = require('../../helpers/date');

const tranformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    creator: getUser.bind(this, event._doc.creator),
    date: dateToString(event._doc.date),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._id,
    _id: booking.id,
    user: getUser.bind(this, booking._doc.user),
    event: getEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

const getUser = userId => {
  return User.findById(userId).then(user => {
    return { ...user._doc, _id: user.id, createdEvents: getEvents.bind(this, user._doc.createdEvents), password: null }
  }).catch(err => {
    throw new Error(err);
  });
};

const getEvents = eventIds => {
  return Event.find({
    _id: { $in: eventIds }
  }).then(events => {
    return events.map(event => {
      return tranformEvent(event);
    })
  }).catch(err => {
    throw new Error(err);
  });
};

const getEvent = eventId => {
  return Event.findById(eventId).then(event => {
    return tranformEvent(event);
  }).catch(err => {
    throw new Error(err);
  });
};

module.exports = { tranformEvent, transformBooking }