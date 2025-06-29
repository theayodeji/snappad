import axios from 'axios';

export async function fetchPropertyById(id: string) {
  try {
    const res = await axios.get(`/api/properties/${id}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || 'Failed to fetch property');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch property');
  }
}
