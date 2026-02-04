import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index on eventId and email to prevent duplicate bookings
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/**
 * Pre-save hook to validate that the referenced Event exists.
 * Prevents orphaned bookings by ensuring event reference is valid.
 */
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId')) {
    // Import Event model here to avoid circular dependency issues
    const Event = models.Event || (await import('./event.model')).default;

    const eventExists = await Event.findById(booking.eventId);

    if (!eventExists) {
      throw new Error(`Event with ID ${booking.eventId} does not exist`);
    }
  }

  next();
});

// Use existing model if available (prevents recompilation in development)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
