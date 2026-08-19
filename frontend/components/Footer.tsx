'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { ArrowUpRight, ChevronUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Footer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    if (!formRef.current) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    emailjs
      .sendForm(
        serviceId,
        templateId,
        formRef.current,
        { publicKey: publicKey }
      )
      .then(
        () => {
          setLoading(false);
          setStatusMessage({ type: 'success', text: 'Subscribed successfully!' });
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          console.error('EmailJS Footer Error:', error);
          setStatusMessage({ type: 'error', text: 'Failed to send. Try again.' });
        }
      );
  };

  return (
    <footer className="relative bg-[#0d0d0e] text-white overflow-hidden pt-16 pb-0">
      {/* Background Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Curved Arch Line Overlay in Center */}
        <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-[600px] h-[350px] border-t border-slate-700/50 rounded-t-full pointer-events-none hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-6 pb-16">
          
          {/* Left Navigation Column */}
          <div className="space-y-5 text-left lg:pt-10">
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                ABOUT US
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                OUR MANEGEMENT
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                PRODUCTS
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                GALLERY
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                POLICIES
              </Link>
            </div>
          </div>

          {/* Center Column: Logo & Email Form */}
          <div className="flex flex-col items-center text-center space-y-8 z-10">
            {/* Logo Image */}
            <Link href="/" className="inline-block">
              <Image 
                src="/NavLogo.png" 
                alt="Maheen Accessories Ltd. Logo" 
                width={240} 
                height={60} 
                className="h-12 w-auto object-contain brightness-0 invert" 
                priority
              />
            </Link>

            {/* Title */}
            <h3 className="text-xs font-bold tracking-[0.25em] text-slate-200 uppercase leading-relaxed max-w-xs">
              EXPRESS YOUR THOUGHT <br /> VIA EMAIL
            </h3>

            {/* Email Input Box Form */}
            <div className="w-full max-w-md space-y-3">
              <form ref={formRef} onSubmit={sendEmail} className="flex items-center w-full border border-slate-700/80 bg-black/40 rounded-sm overflow-hidden">
                <input
                  type="email"
                  name="reply_to"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 border-l border-slate-700/80 text-xs font-bold tracking-widest text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors shrink-0 disabled:opacity-50"
                >
                  <span>{loading ? 'SENDING' : 'SEND'}</span>
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                </button>
              </form>

              {/* Status Message Display */}
              {statusMessage && (
                <div className={`flex items-center justify-center gap-1.5 text-xs font-medium pt-1 ${statusMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{statusMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Navigation Column */}
          <div className="space-y-5 text-left lg:text-right lg:pt-10">
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                SUSTAINABILITY
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                PRODUCT FACILITIES
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                OUR PARTNERS
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                LATEST NEWS
              </Link>
            </div>
            <div>
              <Link href="#" className="text-xs font-bold tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                CONTACT US
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar Section */}
      <div className="border-t border-slate-800/80 bg-[#080809]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Copyright Text */}
          <p className="text-xs text-slate-400 font-medium">
            <span className="font-semibold text-slate-300">Goinnovior</span> Limited, All Rights Reserved
          </p>

          {/* Social Icons & Back to Top Button */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Facebook SVG */}
              <a href="#" className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram SVG */}
              <a href="#" className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Linkedin SVG */}
              <a href="#" className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>

            {/* Scroll to Top Square Button */}
            <button
              onClick={scrollToTop}
              className="w-12 h-16 bg-[#805AD5] hover:bg-[#6b46c1] text-white flex items-center justify-center transition-colors ml-2 -mr-6 lg:-mr-12"
            >
              <ChevronUp size={20} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}