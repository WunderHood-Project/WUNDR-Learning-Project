'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useModal } from '@/app/context/modal';
import { useAuth } from '@/app/context/auth';
import SignupModal from '../signup/SignupModal';
import LoginModal from '../login/LoginModal';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
import { NAV_LINKS } from './navLinks';
import { DesktopNavItems, MobileNavItems } from './NavItems';

export default function Navbar() {
  // --- App state ---
  const { setModalContent } = useModal();
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  // --- UI state ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- Refs used for "click outside" detection ---
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);

  // 1) Close USER dropdown on outside click (runs always)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // 2) Close MOBILE menu on outside click (only when menu is open)
  //    Ignores clicks inside the menu and on the toggle button itself.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (mobileMenuRef.current?.contains(target)) return; // click inside menu -> ignore
      if (menuToggleRef.current?.contains(target)) return; // click on toggle -> ignore
      setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isMenuOpen]);

  // 3) Close both menus on route change
  useEffect(() => {
    setShowDropdown(false);
    setIsMenuOpen(false);
  }, [pathname]);

  // 4) Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // --- Modal openers (typed to accept clicks from any element) ---
  const handleSignup = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    setModalContent(<SignupModal />);
  };
  const handleLogin = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    setModalContent(<LoginModal />);
  };

  return (
    <nav className="bg-gradient-to-r from-wonderbg via-white to-wondersun/20 backdrop-blur-sm border-b border-wonderleaf/20 shadow-lg sticky top-0 z-50">
      {/* smaller horizontal padding on mobile, none on sm+ as you asked */}
      <div className="max-w-7xl mx-auto px-3 sm:px-0">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Brand: logo + name */}
          <Link href="/" className="flex items-center space-x-1 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-wonderleaf/20 rounded-full blur-lg group-hover:bg-wondergreen/30 transition-all duration-300" />
              <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                {/* Logo is smaller on mobile, scales up on breakpoints */}
                <Image
                  src="/logo.png"
                  alt="WonderHood logo"
                  width={60}
                  height={55}
                  priority
                  className="w-10 h-9 sm:w-12 sm:h-11 md:w-[60px] md:h-[50px]"
                  sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 60px"
                />
              </div>
            </div>
            <span className="text-xl md:text-[23px] text-wondergreen font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WonderHood
            </span>
          </Link>

          {/* Desktop Navigation (presentational only) */}
          <DesktopNavItems links={NAV_LINKS} pathname={pathname} />

          {/* Right side: Auth / Profile (desktop only) */}
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
                  <svg className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && <UserDropdown onLogout={logout} onClose={() => setShowDropdown(false)} />}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button
              ref={menuToggleRef}
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(prev => !prev); }}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
            className="relative lg:hidden bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg mt-2 overscroll-contain"
            role="menu"
            aria-label="Mobile navigation"
          >
            {/* Menu items list */}
            <div className="px-3 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4 space-y-1.5">
              <MobileNavItems
                links={NAV_LINKS}
                pathname={pathname}
                onClose={() => setIsMenuOpen(false)}
              />
            </div>

            {/* Auth / Profile block (not sticky) */}
            {isLoggedIn ? (
              <div className="px-3 sm:px-4 pb-3">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center rounded-xl px-3 py-3 bg-gradient-to-r from-wonderleaf/10 to-wondergreen/10 border border-wonderleaf/30 font-semibold text-wondergreen hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {user?.firstName.charAt(0).toUpperCase()}
                  </div>
                  Profile — {user?.firstName}
                </Link>

                <button
                  type="button"
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="mt-2 w-full rounded-xl px-3 py-2.5 text-base font-semibold border text-wondergreen bg-wondersun/60 border-wonderleaf hover:bg-wondersun focus:outline-none focus:ring-2 focus:ring-wonderleaf/40 transition-colors"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </div>
            ) : null}

            {/* Sticky safe-area footer (only when logged OUT) */}
            {!isLoggedIn && (
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-wonderleaf/20 px-3 sm:px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className="h-11 rounded-2xl border-2 border-wondergreen text-wondergreen font-semibold hover:bg-wondergreen/5 focus:outline-none focus:ring-2 focus:ring-wonderleaf/40"
                    onClick={(e) => { handleLogin(e); setIsMenuOpen(false); }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="h-11 rounded-2xl font-semibold text-white bg-gradient-to-r from-wonderleaf to-wondergreen hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-wonderleaf/40"
                    onClick={(e) => { handleSignup(e); setIsMenuOpen(false); }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
