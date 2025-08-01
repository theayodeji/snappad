'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const OTP_LENGTH = 6;
const RESendTime = 30; // seconds

const OtpVerificationPage = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(true);
  const [resendTimeLeft, setResendTimeLeft] = useState(RESendTime);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendTimeLeft > 0) {
        setResendTimeLeft(resendTimeLeft - 1);
      } else {
        setResendAvailable(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimeLeft]);

  const handleChange = (value: string, index: number) => {
    if (value === '' && index > 0) {
      const previous = document.getElementById(`otp-${index - 1}`);
      if (previous) (previous as HTMLInputElement).focus();
    } else if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < OTP_LENGTH - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the full OTP');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await verifyOtp({ email: email, otp: code });
    } catch (e: any) {
      setError(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendAvailable(false);
    setResendTimeLeft(RESendTime);
    await resendOtp(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary px-4">
      <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-xl p-6 sm:p-10 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Verify Your Account
        </h2>
        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-14 text-2xl text-center rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  handleChange('', index);
                }
              }}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full py-3 mt-2 text-white bg-primary rounded-xl hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          Didn't receive code?{' '}
          <button
            className="text-primary hover:underline"
            onClick={handleResend}
            disabled={!resendAvailable}
          >
            {resendAvailable ? 'Resend' : `Resend in ${resendTimeLeft} seconds`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
