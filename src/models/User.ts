// models/User.ts

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs"; // For password hashing

// Define the interface for a User document
export interface IUser extends Document {
    email: string;
    password: string; // Stored as hashed password
    name?: string;
    phone?: string;
    role: "user" | "owner" | "admin"; // Example roles for future expansion
    bookings: mongoose.Types.ObjectId[]; // NEW: Array of ObjectIds referencing Booking model
    savedProperties: mongoose.Types.ObjectId[]; // NEW: Array of ObjectIds referencing Property model
    avatar?: string; // Optional avatar image property (URL or path)
    createdAt: Date;
    updatedAt: Date;
    // Method to compare entered password with hashed password
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures email addresses are unique
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email address",
      ],
      lowercase: true, // Store emails in lowercase
      trim: true, // Trim whitespace
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Prevents the password from being returned in queries by default
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [
        /^\+?\d{10,15}$/, // Basic regex for phone numbers (e.g., +23480...)
        "Please add a valid phone number",
      ],
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user", // Default role for new registrations
    },
    avatar: {
      type: String,
      default: "", // Optional avatar image property (URL or path)
    },
    // --- NEW FIELDS ---
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking", // This tells Mongoose this ID refers to a document in the 'Booking' collection
      },
    ],
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // This tells Mongoose this ID refers to a document in the 'Property' collection
      },
    ],
    // --- END NEW FIELDS ---
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

// --- Mongoose Middleware (Hooks) ---

// Hash password before saving the user document
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// --- Mongoose Methods ---

// Method to compare entered password with hashed password in the database
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
