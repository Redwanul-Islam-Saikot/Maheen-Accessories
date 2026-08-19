'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about-us' },
    { name: 'SUSTAINABILITY', href: '/sustainability' },
    { name: 'PRODUCTS', href: '/products' },
    { name: 'POLICIES', href: '/policies' },
    { name: 'PRODUCTION FACILITIES', href: '/production-facilities' },
    { name: 'CONTACT', href: '/get-in-touch' },
  ];

  // চেক করবে যে বর্তমান রুটের সাথে লিংকটি মিলছে কি না
  const checkIsActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Full width container with generous horizontal padding & fixed height */}
      <div className="w-full px-6 md:px-12 lg:px-16 h-24 flex items-center justify-between">
        
        {/* Left Section: Logo & Mail ID */}
        <div className="flex items-center gap-8 lg:gap-12 shrink-0">
          <Link href="/" className="flex items-baseline gap-1">
            <img 
              src="/NavLogo.png" 
              alt="MAHEEN ACCESSORIES" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="font-semibold text-[#805AD5] text-xs leading-none select-none">
              ltd.
            </span>
          </Link>

          {/* Email section with extra left padding and divider */}
          <div className="hidden xl:flex items-center border-l border-slate-200 pl-8 py-2">
            <a 
              href="mailto:info@maheenaccessories.com" 
              className="flex items-center gap-2.5 text-slate-500 hover:text-slate-800 text-xs tracking-wide transition-colors"
            >
              <Mail size={16} className="text-slate-500" />
              <span>info@maheenaccessories.com</span>
            </a>
          </div>
        </div>

        {/* Center Section: Navigation Menu Items */}
        <nav className="hidden 2xl:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = checkIsActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-[12px] font-bold tracking-widest transition-all py-3 ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#805AD5] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Icons with Space */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          {/* Custom Hamburger Icon */}
          <button className="text-slate-700 hover:text-slate-900 transition-colors p-2">
            <div className="flex flex-col gap-[6px] items-end w-6">
              <span className="w-6 h-[2px] bg-slate-800 rounded-full"></span>
              <span className="w-4 h-[2px] bg-slate-800 rounded-full"></span>
            </div>
          </button>

          {/* Divider line */}
          <div className="h-6 w-[1px] bg-slate-200" />

          {/* Search Button */}
          <button className="text-slate-700 hover:text-slate-900 transition-colors p-2">
            <Search size={20} />
          </button>

          {/* Mobile Screen Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden text-slate-800 p-1"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-3 shadow-lg">
          {navLinks.map((link) => {
            const isActive = checkIsActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest ${
                  isActive
                    ? 'bg-purple-50 text-[#805AD5]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}