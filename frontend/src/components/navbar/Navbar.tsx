'use client';

import Link from 'next/link';
import Image from 'next/image'; // replace <img> to satisfy Next lint
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useModal } from '@/app/context/modal';
import { useAuth } from '@/app/context/auth';
import SignupModal from '../signup/SignupModal';
import LoginModal from '../login/LoginModal';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
import { NAV_LINKS } from './navLinks';      // config-only import
import { DesktopNavItems, MobileNavItems } from './NavItems'; // presentational

export default function Navbar() {
  // Modal controls for Login/Signup
  const { setModalContent } = useModal();

  // Router state
  const pathname = usePathname();

  // Auth state
  const { user, isLoggedIn, logout } = useAuth();

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs for outside-click detection
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Close dropdown when route changes
  useEffect(() => { setShowDropdown(false); }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    const { body } = document;
    if (!body) return;
    body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Open modals
  const handleSignup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<SignupModal />);
  };
  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<LoginModal />);
  };

  return (
    <nav className="bg-gradient-to-r from-wonderbg via-white to-wondersun/20 backdrop-blur-sm border-b border-wonderleaf/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo + name */}
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-wonderleaf/20 rounded-full blur-lg group-hover:bg-wondergreen/30 transition-all duration-300" />
              <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                {/* Next Image instead of <img /> */}
                <Image src="/logo.png" alt="WonderHood logo" width={60} height={55} priority />
              </div>
            </div>
            <span className="text-2xl md:text-[27px] text-wondergreen font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WonderHood
            </span>
          </Link>

          {/* Desktop Navigation (presentational only) */}
          <DesktopNavItems links={NAV_LINKS} pathname={pathname} />

          {/* Right side: Auth / Profile */}
          <div className="hidden lg:flex items-center space-x-4 ml-6 border-l border-wonderleaf/30 pl-6">
            {isLoggedIn && <NotificationBell />}

            {!isLoggedIn && (
              <>
                <div
                  className="px-6 py-1 text-wondergreen font-semibold hover:text-wonderleaf cursor-pointer transition-colors duration-300 hover:bg-wondergreen/5 rounded-lg text-lg border-2 border-wondergreen hover:bg-wondergreen hover:text-white"
                  onClick={handleLogin}
                >
                  Login
                </div>
                <div
                  className="px-6 py-2 bg-gradient-to-r from-wonderleaf to-wondergreen text-white font-semibold rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={handleSignup}
                >
                  Sign Up
                </div>
              </>
            )}

            {isLoggedIn && user && (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setShowDropdown(v => !v)}
                  className={`
                    flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border-2 rounded-xl font-semibold
                    hover:shadow-lg transition-all duration-300 hover:scale-105
                    ${pathname === "/profile"
                      ? "border-wondergreen bg-wondergreen/10 text-wondergreen shadow-lg"
                      : "border-wonderleaf/30 text-wondergreen hover:border-wonderleaf hover:bg-wonderleaf/10"
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm md:text-lg font-bold text-wondergreen">{user.firstName}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showDropdown && <UserDropdown onLogout={logout} onClose={() => setShowDropdown(false)} />}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen} 
              aria-controls="mobile-nav"
              className="p-2 text-wondergreen hover:text-wonderleaf transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
          id="mobile-nav"
          ref={mobileMenuRef}
          className="lg:hidden border-t border-wonderleaf/20 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg mt-2"
          >
            {/* Presentational-only mobile items */}
            <MobileNavItems
              links={NAV_LINKS}
              pathname={pathname}
              onClose={() => setIsMenuOpen(false)}
            />

            {/* Auth controls for mobile */}
            <div className="border-t border-wonderleaf/20 pt-4 space-y-3 px-4 pb-6">
              {!isLoggedIn && (
                <>
                  <div
                    className="block px-4 py-3 text-lg font-semibold text-wondergreen hover:bg-wondergreen/5 rounded-lg cursor-pointer transition-colors duration-300"
                    onClick={(e) => { handleLogin(e); setIsMenuOpen(false); }}
                  >
                    Login
                  </div>
                  <div
                    className="block px-4 py-3 text-lg font-semibold bg-gradient-to-r from-wonderleaf to-wondergreen text-white rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 text-center"
                    onClick={(e) => { handleSignup(e); setIsMenuOpen(false); }}
                  >
                    Sign Up
                  </div>
                </>
              )}

              {isLoggedIn && user && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 bg-gradient-to-r from-wonderleaf/10 to-wondergreen/10 border border-wonderleaf/30 rounded-lg font-semibold text-wondergreen hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                    Profile - {user.firstName}
                  </Link>

                  {/* Logout button for mobile */}
                  <button
                    type="button"
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="
                    w-full px-2.5 py-1.5 text-lg font-semibold rounded-lg border
                    text-wondergreen bg-wondersun/60 border-wonderleaf
                    hover:bg-wondersun focus:outline-none focus:ring-2 focus:ring-wonderleaf/40
                    transition-colors duration-200
                    "
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
