import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: '{VALUE} is not a valid mode',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create unique index on slug for faster lookups
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to generate slug, validate and normalize date and time.
 * - Generates URL-friendly slug from title only when title changes
 * - Ensures slug uniqueness by appending a discriminator on collision
 * - Normalizes date to ISO format (YYYY-MM-DD)
 * - Ensures time is in consistent 24-hour format (HH:MM)
 */
EventSchema.pre('save', async function (next) {
  const event = this as IEvent;

  // Generate slug only if title is new or modified
  if (event.isModified('title')) {
    let baseSlug = generateSlug(event.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug uniqueness by checking for collisions and appending a discriminator
    while (true) {
      const existingEvent = await models.Event?.findOne({
        slug: slug,
        _id: { $ne: event._id } // Exclude current document from check
      });
      
      if (!existingEvent) {
        // Slug is unique
        event.slug = slug;
        break;
      }
      
      // Collision detected, append counter and retry
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // Validate and normalize date to ISO format
  if (event.isModified('date')) {
    event.date = normalizeDateToISO(event.date);
  }

  // Validate and normalize time to 24-hour format
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }

  next();
});

/**
 * Generates a URL-friendly slug from a string
 * Converts to lowercase, replaces spaces/special chars with hyphens
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalizes date string to ISO format (YYYY-MM-DD)
 * Validates that the date is valid and handles timezone-safe parsing
 * Prefers YYYY-MM-DD format to avoid timezone conversions
 */
function normalizeDateToISO(dateString: string): string {
  const trimmed = dateString.trim();
  
  // ISO date-only pattern (YYYY-MM-DD)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (isoDateRegex.test(trimmed)) {
    // Validate that the date is actually valid
    const [year, month, day] = trimmed.split('-').map(Number);
    const testDate = new Date(year, month - 1, day);
    
    // Check if the parsed date matches the input (validates correctness)
    if (
      testDate.getFullYear() === year &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day
    ) {
      return trimmed; // Return ISO date as-is, avoiding timezone conversion
    }
  }
  
  // Fallback: parse the date without timezone conversion
  // Extract year, month, day components and construct locally
  const date = new Date(trimmed);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Please provide a valid date (YYYY-MM-DD or valid date string).');
  }

  // Extract date components locally to avoid UTC conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes time to 24-hour format (HH:MM)
 * Accepts formats like "14:30", "2:30 PM", "02:30"
 */
function normalizeTime(timeString: string): string {
  const trimmed = timeString.trim();

  // Match 24-hour format (HH:MM)
  const time24Regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  // Match 12-hour format with AM/PM (e.g., "2:30 PM", "02:30 PM")
  const time12Regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

  if (time24Regex.test(trimmed)) {
    // Already in 24-hour format, pad with zeros if needed
    const [hours, minutes] = trimmed.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  const match12 = trimmed.match(time12Regex);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const period = match12[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  throw new Error('Invalid time format. Use HH:MM (24-hour) or HH:MM AM/PM (12-hour)');
}

// Use existing model if available (prevents recompilation in development)
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
