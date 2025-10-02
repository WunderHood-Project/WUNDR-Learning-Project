'use client'

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/app/context/modal";
import SignupModal from "../signup/SignupModal";
import LoginModal from '../login/LoginModal';
import React, { useState, useEffect, useRef, } from "react";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/app/context/auth";
import UserDropdown from "./UserDropdown";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { setModalContent } = useModal();
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => { setShowDropdown(false); }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isMenuOpen]);


  const handleSignup = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<SignupModal />);
  }

  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModalContent(<LoginModal />);
  }

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Block the scroll body when the menu is open
  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (isMenuOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
    return () => { body.style.overflow = ''; };
  }, [isMenuOpen]);


  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/support', label: 'Support Us' },
    { href: '/get-involved', label: 'Get Involved' }
  ];

  return (
    <nav className="bg-gradient-to-r from-wonderbg via-white to-wondersun/20 backdrop-blur-sm border-b border-wonderleaf/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo + name */}
          <Link href="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-wonderleaf/20 rounded-full blur-lg group-hover:bg-wondergreen/30 transition-all duration-300"></div>
              <img
                src="/logo.png"
                alt="WonderHood logo"
                width={60}
                height={55}
                className="cursor-pointer relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl md:text-[27px] text-wondergreen font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WonderHood
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-xl font-semibold transition-all duration-300 group ${pathname === href
                  ? "text-wondergreen"
                  : "text-wondergreen hover:text-wondergreen"
                  }`}
              >
                <span className="relative z-10">{label}</span>
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-wonderleaf/10 to-wondergreen/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Active indicator */}
                {pathname === href && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-6 border-l border-wonderleaf/30 pl-6">
              {isLoggedIn && (
                <NotificationBell />
              )}
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

              {/* User Name */}
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
                  {showDropdown && (
                    <UserDropdown onLogout={logout} onClose={() => setShowDropdown(false)} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="lg:hidden border-t border-wonderleaf/20 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg mt-2">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${pathname === href
                    ? "bg-gradient-to-r from-wonderleaf/20 to-wondergreen/20 text-wondergreen border-l-4 border-wondergreen"
                    : "text-gray-700 hover:text-wondergreen hover:bg-wondergreen/5"
                    }`}
                >
                  {label}
                </Link>
              ))}

              <div className="border-t border-wonderleaf/20 pt-4 space-y-3">
                {!isLoggedIn && (
                  <>
                    <div
                      className="block px-4 py-3 text-lg font-semibold text-wondergreen hover:bg-wondergreen/5 rounded-lg cursor-pointer transition-colors duration-300"
                      onClick={(e) => {
                        handleLogin(e);
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </div>
                    <div
                      className="block px-4 py-3 text-lg font-semibold bg-gradient-to-r from-wonderleaf to-wondergreen text-white rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 text-center"
                      onClick={(e) => {
                        handleSignup(e);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </div>
                  </>
                )}

                {isLoggedIn && user && (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}