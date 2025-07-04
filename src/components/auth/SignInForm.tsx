"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import ButtonLoader from "../ui/ButtonLoader";

interface SignInFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  onSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  loading?: boolean;
  onFacebookSignIn?: () => void;
}

function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  onSignIn,
  onGoogleSignIn,
  onFacebookSignIn,
  loading,
}: SignInFormProps) {
  
  return (
    <form onSubmit={onSignIn} className="space-y-4">
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition duration-200"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-base dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-black text-neutral-black dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-primary dark:text-tertiary border-gray-300 rounded focus:ring-primary dark:border-gray-600"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-base dark:text-gray-300"
          >
            Remember me
          </label>
        </div>
        <a href="#" className="font-medium text-primary hover:underline">
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-3 rounded-lg font-semibold  transition duration-200 shadow-md ${
          loading
            ? "bg-gray-500 dark:bg-gray-500 cursor-not-allowed hover:bg-gray-500 dark:hover:bg-gray-500"
            : "bg-primary dark:bg-primary hover:bg-primary/80"
        }`}
      >
        {loading ? <ButtonLoader /> : "Sign in"}
      </button>
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
          OR
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <div className="space-y-4">
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
      </div>
    </form>
  );
}

export default SignInForm;
