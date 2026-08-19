'use client';

import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GetInTouchSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    if (!formRef.current) return;

    // Fetching keys directly from .env.local
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    emailjs
      .sendForm(
        serviceId,
        templateId,
        formRef.current,
        { publicKey: publicKey } // Object style is required for newer EmailJS SDKs
      )
      .then(
        () => {
          setLoading(false);
          setStatusMessage({ type: 'success', text: 'Message sent successfully!' });
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          console.error('EmailJS Error Detail:', error);
          setStatusMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
        }
      );
  };

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-8 md:px-12 lg:px-20 font-sans relative overflow-hidden">
      
      {/* Background Wave Texture Image */}
      <div 
        className="absolute inset-x-0 top-[40%] h-72 sm:h-96 md:h-[420px] bg-center bg-no-repeat bg-contain pointer-events-none z-0"
        style={{ 
          backgroundImage: `url('/texture.png')`,
          filter: 'invert(1) opacity(0.85)',
          mixBlendMode: 'difference'
        }}
      />

      {/* Container aligned */}
      <div className="max-w-[1240px] mx-auto space-y-16 relative z-10">
        
        {/* Contact Form Card */}
        <div className="bg-white border border-slate-300 rounded-xl p-8 sm:p-14 md:p-16 shadow-lg text-center relative z-10 w-full">
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-3 mb-12 font-medium">
            Contact us for a great photography session & beautiful captured moments
          </p>

          <form ref={formRef} onSubmit={sendEmail} className="space-y-10 max-w-4xl mx-auto text-left">
            
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <input
                  type="text"
                  name="from_name" // Make sure this matches your EmailJS template variable
                  required
                  placeholder="Name*"
                  className="w-full border-b border-slate-300 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors bg-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="reply_to" // Make sure this matches your EmailJS template variable
                  required
                  placeholder="E-mail*"
                  className="w-full border-b border-slate-300 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors bg-transparent"
                />
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <input
                type="text"
                name="subject" // Make sure this matches your EmailJS template variable
                required
                placeholder="Subject*"
                className="w-full border-b border-slate-300 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors bg-transparent"
              />
            </div>

            {/* Text / Message Input */}
            <div className="pt-2">
              <textarea
                rows={3}
                name="message" // Make sure this matches your EmailJS template variable
                required
                placeholder="Message*"
                className="w-full border-b border-slate-300 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors resize-none bg-transparent"
              />
            </div>

            {/* Success/Error Alert Message */}
            {statusMessage && (
              <div
                className={`flex items-center gap-2 p-4 rounded-lg text-sm font-semibold ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Send Mail Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative bg-[#e2e8e5] text-slate-900 px-8 py-3 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 hover:text-[#004d3d] flex items-center gap-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />

                <span>{loading ? 'Sending...' : 'Send Mail'}</span>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Footer Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 relative z-10 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Our Mail</h4>
              <p className="text-xs sm:text-sm text-slate-600 underline font-medium">
                info@moheenaccessories.com
              </p>
              <a href="mailto:info@moheenaccessories.com" className="inline-block text-xs font-extrabold text-slate-900 tracking-wider uppercase pt-2 hover:text-purple-600 transition-colors">
                MAIL NOW
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Call Us</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                +8801713896882
              </p>
              <a href="tel:+8801713896882" className="inline-block text-xs font-extrabold text-slate-900 tracking-wider uppercase pt-2 hover:text-purple-600 transition-colors">
                CALL NOW
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Our Address</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                House #428, Road # 24, Gulshan-1, Dhaka-1212, Bangladesh.
              </p>
              <a href="#" className="inline-block text-xs font-extrabold text-slate-900 tracking-wider uppercase pt-2 hover:text-purple-600 transition-colors">
                VIEW MAP
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}