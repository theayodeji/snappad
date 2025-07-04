import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  ownerContact: {
    email: string;
    phone?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export function usePropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favorite property IDs for the current user
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [favoriting, setFavoriting] = useState(false);

  // Fetch all properties
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get('/api/properties')
      .then((res) => {
        if (res.data.success) {
          setProperties(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch properties');
        }
      })
      .catch((err) => setError(err.message || 'Failed to fetch properties'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch favorite properties for the user
  useEffect(() => {
    axios
      .get('/api/favorites')
      .then((res) => {
        if (res.data.success) {
          setFavoriteProperties(res.data.data.map((p: any) => p.propertyId));
        }
      })
      .catch(() => setFavoriteProperties([]));
  }, []);

  // Add a property to favorites for the user
  const addFavorite = async (propertyId: string) => {
    setFavoriting(true);
    try {
      const res = await axios.post('/api/favorites', { propertyId });
      if (res.data.success) {
        setFavoriteProperties((prev) => [...prev, propertyId]);
      }
    } catch {
      // Optionally handle error
    } finally {
      setFavoriting(false);
    }
  };

  // Remove a property from favorites for the user
  const removeFavorite = async (propertyId: string) => {
    setFavoriting(true);
    try {
      const res = await axios.delete(`/api/favorites/${propertyId}`);
      if (res.data.success) {
        setFavoriteProperties((prev) => prev.filter((id) => id !== propertyId));
      }
    } catch {
      // Optionally handle error
    } finally {
      setFavoriting(false);
    }
  };

  // Check if a property is a favorite
  const isFavorite = (propertyId: string) => favoriteProperties.includes(propertyId);

  return {
    properties,
    loading,
    error,
    favoriteProperties,
    addFavorite,
    removeFavorite,
    isFavorite,
    favoriting,
  };
}
