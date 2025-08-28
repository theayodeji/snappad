// src/components/Navbar/AuthButtonsOrUserMenu.tsx
import React from 'react';
import Link from 'next/link';
import { User, LogOut, Bookmark, Home as HomeIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from './ui/skeleton';


//eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AuthButtonsOrUserMenuProps {
  // No props needed as it uses useAuth directly
}

const AuthButtonsOrUserMenu: React.FC<AuthButtonsOrUserMenuProps> = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return <div className="hidden md:flex items-center space-x-4"><Skeleton className="h-8 w-32 rounded-2xl" /></div>;
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <div className="relative group">
          <button className="flex items-center gap-2 text-text-base dark:text-gray-300 bg-secondary/70 dark:bg-neutral-dark/80 backdrop-blur-md px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
            <User size={18} />
            <span className="font-medium">{user?.name || user?.email?.split('@')[0] || 'Profile'}</span>
          </button>
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-52 bg-white/70 dark:bg-neutral-dark/80 backdrop-blur-md rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top-right">
            <Link href="/profile" className="flex items-center px-4 py-2 text-base dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-colors duration-300">
              <User size={16} className="mr-2" /> My Profile
            </Link>
            {user?.role === 'guest' && <Link href="/my-bookings" className="flex items-center px-4 py-2 text-base dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-colors duration-300">
              <HomeIcon size={16} className="mr-2" /> My Bookings
            </Link>}
            {user?.role === 'guest' && <Link href="/saved-properties" className="flex items-center px-4 py-2 text-base dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-colors duration-300">
              <Bookmark size={16} className="mr-2" /> Saved Properties
            </Link>}
            {(user?.role === 'host' || user?.role === 'admin') && (
              <Link href="/dashboard" className="flex items-center px-4 py-2 text-base dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-colors duration-300">
                <LayoutDashboard size={16} className="mr-2" /> Host Dashboard
              </Link>
            )}
            <hr className="my-1 border-gray-200 dark:border-white/20" />
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
          <Link href="/auth/register" className="bg-primary hover:bg-tertiary text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in shadow-md">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtonsOrUserMenu;
