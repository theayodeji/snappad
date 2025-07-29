"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const DashboardGreeting: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
    );
  }

  const [firstName] = user?.name?.split(" ") || [];

  return (
    <div className="text-4xl font-semibold">
      Hello, <span className="text-primary">{firstName}</span>!
    </div>
  );
};

export default DashboardGreeting;
