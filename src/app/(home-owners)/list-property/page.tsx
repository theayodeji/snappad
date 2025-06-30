"use client"

import React, { useState } from 'react';
import { Open_Sans } from 'next/font/google';
import TextInput from '../../(guests)/properties/TextInput';

const openSans = Open_Sans({ subsets: ['latin'] });

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrls: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    amenities: '',
    capacity: '',
    bedrooms: '',
    beds: '',
    bathrooms: '',
    propertyType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrls: formData.imageUrls.split(',').map(url => url.trim()),
          ownerContact: {
            email: formData.email,
            phone: formData.phone,
          },
          location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
          amenities: formData.amenities.split(',').map(a => a.trim()),
          capacity: parseInt(formData.capacity),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          beds: formData.beds ? parseInt(formData.beds) : undefined,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
          propertyType: formData.propertyType,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Property listed successfully!');
        setFormData({
          title: '', description: '', price: '', imageUrls: '', email: '', phone: '',
          address: '', city: '', state: '', country: '', zipCode: '',
          amenities: '', capacity: '', bedrooms: '', beds: '', bathrooms: '', propertyType: '',
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('An error occurred while listing the property.');
    }
  };

  return (
    <div className={`${openSans.className} max-w-2xl mx-auto p-6 bg-secondary-light dark:bg-secondary-dark shadow-md rounded-md`}>
      <h1 className="text-2xl font-bold mb-6 text-primary-dark dark:text-primary-light">List a New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <TextInput label="Price" name="price" value={formData.price} onChange={handleChange} type="number" required />
        <TextInput label="Image URLs (comma-separated)" name="imageUrls" value={formData.imageUrls} onChange={handleChange} />
        <TextInput label="Owner Email" name="email" value={formData.email} onChange={handleChange} type="email" required />
        <TextInput label="Owner Phone" name="phone" value={formData.phone} onChange={handleChange} />

        <TextInput label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <TextInput label="City" name="city" value={formData.city} onChange={handleChange} required />
        <TextInput label="State / Province" name="state" value={formData.state} onChange={handleChange} required />
        <TextInput label="Country" name="country" value={formData.country} onChange={handleChange} required />
        <TextInput label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />

        <TextInput label="Capacity (max guests)" name="capacity" value={formData.capacity} onChange={handleChange} type="number" required />
        <TextInput label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" />
        <TextInput label="Beds" name="beds" value={formData.beds} onChange={handleChange} type="number" />
        <TextInput label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" />

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-primary-light">Amenities (comma-separated)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-neutral-dark dark:border-white rounded-md shadow-sm sm:text-sm bg-white dark:bg-dark text-black"
            placeholder="e.g. WiFi, Pool, AC"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-primary-light">Property Type</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-neutral-dark dark:border-white rounded-md shadow-sm sm:text-sm bg-white dark:bg-dark text-black"
          >
            <option value="">Select type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Room">Room</option>
            <option value="Villa">Villa</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-primary-light">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-neutral-dark dark:border-white rounded-md shadow-sm sm:text-sm bg-white dark:bg-dark text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-3xl shadow-sm cursor-pointer transition duration-500 font-semibold text-lg"
        >
          List Property
        </button>
      </form>
    </div>
  );
}
