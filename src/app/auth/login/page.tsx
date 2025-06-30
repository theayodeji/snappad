"use client"
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LifeBuoy,
} from "lucide-react"; // Updated icons for context
import { FaGoogle, FaFacebookF } from "react-icons/fa"; // For social login icons
import SignInForm from "./SignInForm";
import illustration from "../_assets/illustration.png"; // Adjust the path as necessary


// This component represents the basic UI of the Snappad Sign-in page.
// It includes placeholders for form handling and authentication logic.
const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Placeholder for sign-in logic
  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign In clicked:", { email, password, rememberMe });
    // Implement your authentication logic here
    alert("Sign In functionality is a placeholder.");
  };

  // Placeholder for social login
  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    alert("Google Sign In functionality is a placeholder.");
  };

  // Placeholder for social login
  const handleFacebookSignIn = () => {
    console.log("Continue with Facebook clicked");
    alert("Facebook Sign In functionality is a placeholder.");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center font-inter">
      {/* Main container for the two columns */}
      <div
        className="flex flex-col items-center justify-center md:flex-row w-full max-w-6xl bg-white dark:bg-black rounded-2xl overflow-hidden
                  min-h-[675px] max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {/* Left Column: Sign-in Form */}
        <div className="w-full md:w-1/2 p-8 md:px-18 flex flex-col justify-center">
          <div className="mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-tertiary text-center">
              Welcome
              <span className="text-black"> back!</span>
            </h2>
            <p className="text-text-base dark:text-gray-400 text-sm mt-2">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-primary dark:text-tertiary hover:underline"
              >
                Create now
              </a>
            </p>
          </div>

          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            onSignIn={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
          />
        </div>

        {/* Right Column: Promotional Content */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 p-8 md:p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Top Right Support */}
          <div className="absolute top-6 right-6 flex items-center text-gray-200 text-sm">
            <span className="mr-2">Support</span>
            <LifeBuoy size={20} /> {/* Generic support icon */}
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
            <p className="text-black dark:text-tertiary text-sm mb-8 max-w-xs">
              Discover amazing properties, book seamless stays, and explore new
              destinations with Snappad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
