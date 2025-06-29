// models/Property.ts

import mongoose, { Document, Schema } from 'mongoose';


export interface IProperty extends Document { // Extend Document to include _id, createdAt, etc.
  title: string;
  description: string;
  price: number; // Price per night
  imageUrls: string[];
  ownerContact: {
    email: string;
    phone?: string;
  };
  location: { // New: For search and better description
    address: string;
    city: string;
    state: string; // Or region/province
    country: string;
    zipCode?: string;
  };
  amenities: string[]; // New: e.g., ['WiFi', 'Pool', 'AC']
  capacity: number; // New: Max number of guests
  bedrooms?: number; // New: Number of bedrooms
  beds?: number; // New: Number of beds
  bathrooms?: number; // New: Number of bathrooms
  propertyType: 'Apartment' | 'House' | 'Condo' | 'Room' | 'Villa' | 'Other'; // New: Type of property
  // owner?: mongoose.Types.ObjectId; // Future: reference to User model if authentication is added
  // isAvailable?: boolean; // You typically don't store this directly, but calculate from bookings
}

const PropertySchema: Schema<IProperty> = new mongoose.Schema<IProperty>({
  title: {
    type: String,
    required: [true, 'Please add a title for the property.'],
    maxlength: [100, 'Title cannot be more than 100 characters'], // Increased max length
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the property.'],
    maxlength: [1500, 'Description cannot be more than 1500 characters'], // Increased max length
  },
  price: {
    type: Number,
    required: [true, 'Please add a price per night.'],
    min: [0, 'Price cannot be negative'], // Added min validation
  },
  imageUrls: {
    type: [String],
    default: [],
    required: [true, 'At least one image URL is required.'], // Added requirement for images
  },
  ownerContact: {
    email: {
      type: String,
      required: [true, 'Owner email is required for contact.'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: String,
  },
  location: {
    address: { type: String, required: [true, 'Address is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    state: { type: String, required: [true, 'State/Province is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
    zipCode: String,
  },
  amenities: {
    type: [String],
    default: [],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required.'],
    min: [1, 'Capacity must be at least 1'],
  },
  bedrooms: Number,
  beds: Number,
  bathrooms: Number,
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Room', 'Villa', 'Other'],
    required: [true, 'Property type is required.'],
  },
  // owner: { // Future: uncomment and add this if/when you implement User authentication
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Refers to your User model
  //   required: true, // A property must have an owner
  // },
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);