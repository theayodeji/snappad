// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// Ensure these import paths are correct based on your file structure
// If DesktopNavLinks, AuthButtonsOrUserMenu, MobileMenuOverlay are directly in src/components,
// then '../' is correct. If they are in src/components/Navbar/, then './Navbar/' is correct.
import DesktopNavLinks from '../DesktopNavLinks';
import AuthButtonsOrUserMenu from '../AuthButtonsOrUserMenu';
import MobileMenuOverlay from '../MobileMenuOverlay';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Define navLinks here as it's shared by both desktop and mobile components
  const navLinks = [
    { name: 'Listings', href: '/', roles: ['user', 'owner', 'admin', 'visitor'] },
    { name: 'About', href: '/about', roles: ['user', 'owner', 'admin', 'visitor'] }, // Re-added
    { name: 'Contact', href: '/contact', roles: ['user', 'owner', 'admin', 'visitor'] }, // Re-added
    { name: 'My Bookings', href: '/my-bookings', authRequired: true, roles: ['user', 'owner', 'admin'] },
    { name: 'Saved', href: '/saved-properties', authRequired: true, roles: ['user', 'owner', 'admin'] },
    { name: 'Owner Dashboard', href: '/owner/dashboard', authRequired: true, roles: ['owner', 'admin'] },
  ];

  // Close mobile menu on outside click (logic remains in parent for now as it controls the overlay)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white dark:bg-black shadow-xs sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
        {/* Logo/Brand Name */}
        <Link href="/" className="flex items-center text-neutral-dark dark:text-white text-2xl font-bold">
          Snappad
        </Link>

        {/* Desktop Navigation Links (extracted component) */}
        <DesktopNavLinks navLinks={navLinks} />

        {/* Desktop Auth Buttons / User Menu (extracted component) */}
        <AuthButtonsOrUserMenu />

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-base dark:text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay (extracted component) */}
      <MobileMenuOverlay
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        mobileMenuRef={mobileMenuRef}
        navLinks={navLinks}
      />
    </nav>
  );
};

export default Navbar;
