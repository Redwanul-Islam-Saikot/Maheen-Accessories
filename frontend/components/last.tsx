'use client';

import React from 'react';

const INSTAGRAM_IMAGES = [
  { id: 1, src: '/Products2.png', alt: 'Button sample 1' },
  { id: 2, src: '/Products7.png', alt: 'Button sample 2' },
  { id: 3, src: '/Products8.png', alt: 'Button sample 3' }, // Center image
  { id: 4, src: '/Products7.png', alt: 'Button sample 4' },
  { id: 5, src: '/Products5.png', alt: 'Button sample 5' },
];

// Pure SVG Icon for Instagram
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function LastSection() {
  return (
    <section className="w-full bg-white overflow-hidden">
      {/* 5-Column Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full">
        {INSTAGRAM_IMAGES.map((item, index) => {
          const isCenter = index === 2; // ৩ নম্বর (মাঝের) ইমেজ

          return (
            <div 
              key={item.id} 
              className="relative group aspect-square w-full overflow-hidden bg-slate-100"
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Center Image - Ultra Light & Soft Overlay Box */}
              {isCenter ? (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center p-2 z-10">
                  <a
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/30 backdrop-blur-[2px] px-6 py-3 rounded-none flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/50"
                  >
                    <InstagramIcon className="w-4 h-4 text-slate-900 mb-1" />
                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-slate-900 uppercase">
                      Follow Us On Instagram
                    </span>
                  </a>
                </div>
              ) : (
                /* Hover Overlay for other images */
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white z-10"
                >
                  <InstagramIcon className="w-7 h-7" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}