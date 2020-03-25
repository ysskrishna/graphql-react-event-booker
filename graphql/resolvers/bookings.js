const Event = require('../../models/events');
const Booking = require('../../models/bookings');
const { tranformEvent, transformBooking } = require('./common');

module.exports = {
  bookings: () => {
    return Booking.find().then(bookings => {
      return bookings.map(booking => {
        return transformBooking(booking)
      })
    }).catch(err => {
      throw err;
    });
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5e7a41b8ddb5b929203802a3',
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args) => {
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