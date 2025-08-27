// src/components/MobileMenuOverlay.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface NavLink {
  name: string;
  href: string;
  authRequired?: boolean;
  roles?: string[];
}

interface MobileMenuOverlayProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  navLinks: NavLink[];
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuRef,
  navLinks,
}) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const canViewLink = (linkRoles: string[] | undefined) => {
    if (!linkRoles) return true;

    if (!isAuthenticated) {
      return linkRoles.includes("visitor");
    }

    return user && linkRoles.includes(user.role);
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
      <motion.div
        ref={mobileMenuRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "linear" } }}
        exit={{ opacity: 0, y: 50, transition: { duration: 0.3, ease: "anticipate" } }}
        className="md:hidden absolute top-0 left-0 w-full h-screen bg-white dark:bg-black shadow-lg py-6 px-4 z-40 transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-text-base dark:text-white"
          >
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col space-y-6 text-lg">
          {navLinks.map(
            (link) =>
              canViewLink(link.roles) &&
              (!link.authRequired || isAuthenticated) && (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-neutral-dark dark:text-gray-200 hover:text-primary transition-colors py-2
                ${pathname === link.href ? "font-bold text-primary" : ""}`}
                >
                  {link.name}
                </Link>
              )
          )}
          <hr className="border-gray-200 dark:border-gray-700 my-4" />
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-neutral-dark dark:text-gray-200 hover:text-primary py-2"
              >
                <User size={20} className="mr-3" /> My Profile
              </Link>
              {(user?.role === "host" || user?.role === "admin") && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-neutral-dark dark:text-gray-200 hover:text-primary py-2"
                >
                  <LayoutDashboard size={20} className="mr-3" /> Host Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center text-red-500 hover:text-red-600 py-2"
              >
                <LogOut size={20} className="mr-3" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-primary font-semibold py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-primary hover:bg-tertiary text-white px-4 py-2 rounded-full text-center transition-colors shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuOverlay;
