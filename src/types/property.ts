// types/property.ts
import { User } from './user';

export interface Property {
  _id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  imageUrls: string[];
  price: number;
  features?: string[];
  ownerContact?: {
    phone?: string;
    email?: string;
  };
  owner?: User;
  propertyType?: string;
  createdAt?: string;
  updatedAt?: string;
}
