// src/app/register/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LifeBuoy } from "lucide-react"; // Icons for promotional content
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast"; // For user feedback

// Import the dedicated RegisterForm component
import RegisterForm from "@/components/auth/RegisterForm";

// Assuming illustration.png is in src/app/_assets/
import illustration from "../_assets/illustration.png";

interface RegisterFormData{
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  role?: 'guest' | 'host' | undefined; // Assuming role can be either guest or host
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    role: 'guest',
  });

  const { register, loading } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role, // Include role in registration
    });
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    toast.success("Google Sign Up functionality is a placeholder.");
  };

  const handleFacebookSignIn = () => {
    console.log("Continue with Facebook clicked");
    toast.success("Facebook Sign Up functionality is a placeholder.");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center font-inter">
      {/* Main container for the two columns - Matches LoginPage structure */}
      <div
        className="flex flex-col items-center justify-center md:flex-row w-full max-w-6xl bg-white dark:bg-black rounded-2xl
                   min-h-[675px] overflow-y-auto"
      >
        {/* Left Column: Register Form Content - Matches LoginPage left column styling */}
        <div className="w-full md:w-1/2 p-8 md:px-18 flex flex-col justify-center">
          <div className="mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
              <span className="text-black dark:text-white">Create</span> Your
              Account
            </h2>
            <p className="text-text-base dark:text-white text-sm mt-2 text-start">
              {/* Added text-center here */}
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Dedicated RegisterForm component */}
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            onSubmit={handleRegister}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
          />
        </div>

        {/* Right Column: Promotional Content - Directly copied from LoginPage */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 p-8 md:p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Top Right Support */}
          <div className="absolute top-6 right-6 flex items-center text-gray-200 text-sm">
            <span className="mr-2">Support</span>
            <LifeBuoy size={20} />
          </div>

          <img
            src={illustration.src}
            alt="Snappad Travel"
            className="w-[40%] mx-auto object-contain"
          />

          {/* Main Promotional Content */}
          <div className="flex flex-col items-center text-center justify-center">
            <h3 className="text-3xl md:text-4xl text-primary dark:text-white font-bold mb-6 leading-tight">
              Unlock Your Next Adventure
            </h3>
            <p className="text-black dark:text-white text-sm mb-8 max-w-xs">
              Discover amazing properties, book seamless stays, and explore new
              destinations with Snappad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
