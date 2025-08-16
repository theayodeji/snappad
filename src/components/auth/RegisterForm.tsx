// src/components/Auth/RegisterForm.tsx
"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import ButtonLoader from "../ui/ButtonLoader";
import RoleSelector from "./RoleSelector";

interface RegisterFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    role?: "guest" | "host"; // Optional role field
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    role?: 'host' | 'guest'; // Optional role field
  }>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
}

function RegisterForm({
  formData,
  setFormData,
  loading,
  onSubmit,
  onGoogleSignIn,
  onFacebookSignIn,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="John Doe"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition duration-200"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="example@gmail.com"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition duration-200"
          required
        />
      </div>
      <RoleSelector
        selectedRole={formData.role ?? null}
        setSelectedRole={(role) => setFormData(prev => ({ ...prev, role }))}
      />

      {/* Phone Number Field (Optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="+234 801 234 5678"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition duration-200"
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={formData.showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={formData.showPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition duration-200"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 shadow-md ${
          loading
            ? "bg-gray-500 dark:bg-gray-500 cursor-not-allowed hover:bg-gray-500 dark:hover:bg-gray-500"
            : "bg-primary dark:bg-primary hover:bg-primary/80"
        }`}
      >
        {loading ? <ButtonLoader /> : "Register"}
      </button>

      {/* OR Divider */}
      {/* <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
          OR
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div> */}

      {/* Social Logins */}
      {/* <div className="space-y-4">
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-text-base dark:text-gray-300 font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition duration-200 shadow-sm"
        >
          <FaGoogle className="mr-3 text-lg" /> Continue with Google
        </button>
        <button
          type="button"
          onClick={onFacebookSignIn}
          className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-text-base dark:text-gray-300 font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition duration-200 shadow-sm"
        >
          <FaFacebookF className="mr-3 text-lg" /> Continue with Facebook
        </button>
      </div> */}
    </form>
  );
}

export default RegisterForm;
