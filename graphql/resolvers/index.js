const bcrypt = require('bcryptjs');

const Event = require('../../models/events');
const User = require('../../models/users');
const Booking = require('../../models/bookings');

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
      return {
        ...event._doc,
        _id: event.id,
        creator: getUser.bind(this, event._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      };
    })
  }).catch(err => {
    throw new Error(err);
  });
};

const getEvent = eventId => {
  return Event.findById(eventId).then(event => {
    return {
      ...event._doc,
      _id: event.id,
      creator: getUser.bind(this, event._doc.creator),
    }
  }).catch(err => {
    throw new Error(err);
  });
};

module.exports = {
  events: () => {
    return Event.find().then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: getUser.bind(this, event._doc.creator),
          date: new Date(event._doc.date).toISOString(),
        };
      })
    }).catch(err => {
      throw err;
    });
  },
  bookings: () => {
    return Booking.find().then(bookings => {
      return bookings.map(booking => {
        return {
          ...booking._id,
          _id: booking.id,
          user: getUser.bind(this, booking._doc.user),
          event: getEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        }
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
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: getUser.bind(this, result._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      };
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
      return { 
        ...result._doc, 
        _id: result._doc._id.toString(), 
        password: null 
      };
    }).catch(err => {
      throw err;
    })
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5e7a41b8ddb5b929203802a3',
      event: fetchedEvent
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result._doc._id.toString(),
      user: getUser.bind(this, booking._doc.user),
      event: getEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: getUser.bind(this, booking.event._doc.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
}