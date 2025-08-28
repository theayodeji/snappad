import { useState } from "react";
import axios from "@/lib/api";
import type { AxiosError } from "axios";

export interface PaymentResponse {
  data?: {
    accessCode: string;
    authorization_url: string;
    reference: string;
  };
  status: string;
  message?: string;
}

export interface PaymentParams {
  bookingId: string;
  propertyId: string;
  amount: number;
}

export interface VerifyPaymentParams {
  bookingId: string;
  reference: string;
}

export interface UsePaymentReturn {
  initializeCheckout: (params: PaymentParams) => Promise<PaymentResponse>;
  verifyPayment: (params: VerifyPaymentParams) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  resetError: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  const initializeCheckout = async ({ bookingId, propertyId, amount }: PaymentParams): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/checkout", {
        bookingId,
        propertyId,
        amount,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async ({ bookingId, reference }: VerifyPaymentParams) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await axios.post("/verify-payment", {
        bookingId,
        reference,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || 'Payment verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    initializeCheckout,
    verifyPayment,
    isLoading,
    isVerifying,
    error,
    resetError,
  };
};

export default usePayment;
