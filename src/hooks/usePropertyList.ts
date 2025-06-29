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

  return { properties, loading, error };
}
