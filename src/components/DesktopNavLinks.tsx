// src/components/DesktopNavLinks.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // To check user role and auth status

interface NavLink {
  name: string;
  href: string;
  authRequired?: boolean;
  roles?: string[];
}

interface DesktopNavLinksProps {
  navLinks: NavLink[];
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({ navLinks }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();

  // Refined helper function to check if a link should be visible for the current user's role
  const canViewLink = (linkRoles: string[] | undefined) => {
    if (!linkRoles) return true; // If roles are not specified, it's a public link by default

    // If user is NOT authenticated (visitor)
    if (!isAuthenticated) {
      return linkRoles.includes('visitor');
    }

    // If user IS authenticated, check if their role is in the allowed roles
    return user && linkRoles.includes(user.role);
  };

  return (
    <div className="hidden md:flex items-center space-x-6">
      {!loading && navLinks.map((link) => (
        // Conditionally render links based on authentication status AND user role
        (canViewLink(link.roles) && (!link.authRequired || isAuthenticated)) && (
          <Link
            key={link.name}
            href={link.href}
            className={`text-text-base dark:text-gray-300 hover:text-primary transition-colors
              ${pathname === link.href ? 'font-semibold text-primary' : ''}`}
          >
            {link.name}
          </Link>
        )
      ))}
    </div>
  );
};

export default DesktopNavLinks;
