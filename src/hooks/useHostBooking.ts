import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/api";
import { Property } from '@/types/property';
import { User } from '@/types/user';

interface Booking {
  _id: string;
  property: Property;
  guest: Pick<User, '_id' | 'name' | 'email' | 'phone'>;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchHostBookings(hostId: string): Promise<Booking[]> {
  const { data } = await axios.get<{ success: boolean, bookings: Booking[] }>("/hosts/bookings", { 
    params: { 
      userId: hostId 
    } 
  });
  return data.success ? data.bookings : [];
}

export function useHostBookings(hostId: string | undefined) {
  return useQuery<Booking[], Error>({
    queryKey: ["bookings", "host", hostId],
    queryFn: () => fetchHostBookings(hostId!), // Non-null assertion since we have enabled check
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
