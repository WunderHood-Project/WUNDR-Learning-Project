'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useModal } from '@/context/modal';
import { useAuth } from '@/context/auth';
import SignupModal from '../signup/SignupModal';
import LoginModal from '../login/LoginModal';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
import { NAV_LINKS } from './navLinks';
import { DesktopNavItems, MobileNavItems } from './NavItems';
import MobileUserBlock from './MobileUserBlock';

type UserRole = 'admin' | 'parent' | 'instructor' | 'volunteer';

export default function Navbar() {
  // --- App state ---
  const { setModalContent } = useModal();
  const pathname = usePathname();
  const { user, isLoggedIn, logout, authReady } = useAuth();

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
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 md:h-20">
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
            <span className="text-lg lg:text-[21px] xl:text-[23px] text-wondergreen font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WonderHood
            </span>
          </Link>

          {/* Desktop Navigation (presentational only) */}
          <div className="hidden md:flex justify-center justify-self-center lg:pl-6 xl:pl-14">
            <DesktopNavItems links={NAV_LINKS} pathname={pathname} />
          </div>


          {/* Right side: Auth / Profile (desktop only) */}
          <div className="hidden lg:flex items-center
            ml-6 lg:ml-6 xl:ml-6
            pr-24
            border-l border-wonderleaf/30
            shrink-0 lg:w-[320px] xl:w-[360px] justify-end gap-4">

            {!authReady ? (
              <div className="invisible flex items-center gap-4">
                <div className="h-11 w-11 rounded-full" />
                <div className="h-11 w-[230px] rounded-xl" />
              </div>
            ) : (
              <>
                <div className="shrink-0 flex justify-center">
                  {isLoggedIn && <NotificationBell />}
                </div>

                {!isLoggedIn && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="
                        h-11 px-5 rounded-2xl border-2 border-wondergreen
                        text-wondergreen font-semibold transition hover:bg-wondergreen/5
                        whitespace-nowrap
                        lg:h-10 lg:px-4 lg:text-[15px] lg:min-w-[100px]
                        xl:h-11 xl:px-5 xl:text-[17px]
                      "
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={handleSignup}
                      className="
                        h-11 px-5 rounded-2xl font-semibold text-white
                        bg-gradient-to-r from-wonderleaf to-wondergreen transition hover:shadow-lg
                        whitespace-nowrap
                        lg:h-10 lg:px-4 lg:text-[15px] lg:min-w-[116px]
                        xl:h-11 xl:px-5 xl:text-[17px]
                      "
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {isLoggedIn && user && (
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setShowDropdown(v => !v)}
                      className={`h-11 pl-2 pr-3.5 rounded-xl font-semibold flex items-center
                                  border-2 bg-white/70 backdrop-blur-sm hover:shadow-lg transition
                                  ${pathname === "/profile"
                                    ? "border-wondergreen bg-wondergreen/10 text-wondergreen"
                                    : "border-wonderleaf/30 text-wondergreen hover:border-wonderleaf hover:bg-wonderleaf/10"}`}
                    >
                      <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen
                                      text-white font-bold text-sm flex items-center justify-center">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-base md:text-lg font-bold">{user.firstName}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <UserDropdown onLogout={logout} onClose={() => setShowDropdown(false)} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden justify-self-end">
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
            {authReady && isLoggedIn && (
              <div className="px-3 sm:px-4 pb-3">
                <MobileUserBlock
                  fullName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
                  role={(user?.role ?? 'parent') as UserRole}
                  onLogout={logout}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              </div>
            )}

            {/* Sticky safe-area footer (only when logged OUT) */}
            {authReady && !isLoggedIn && (
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

