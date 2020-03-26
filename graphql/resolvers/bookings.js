const Event = require('../../models/events');
const Booking = require('../../models/bookings');
const { tranformEvent, transformBooking } = require('./common');

module.exports = {
  bookings:(args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    return Booking.find({user:req.userId}).then(bookings => {
      return bookings.map(booking => {
        return transformBooking(booking)
      })
    }).catch(err => {
      throw err;
    });
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = tranformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
}