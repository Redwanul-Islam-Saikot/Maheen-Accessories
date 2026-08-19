'use client';

import React from 'react';

// Related Garments Accessories Data
const leftColumnProducts = [
  {
    id: 1,
    tag: 'XYZ-01',
    title: 'Custom Metal Buttons & Studs',
    aspectRatio: 'aspect-[4/5]',
    image: '/Products1.png',
  },
  {
    id: 2,
    tag: 'XYZ-03',
    title: 'Vintage Alloy Metal Plates',
    aspectRatio: 'aspect-[4/4.5]',
    image: '/Products3.png',
  },
  {
    id: 3,
    tag: 'XYZ-05',
    title: 'Eco-Friendly Printed Hangtags',
    aspectRatio: 'aspect-[3/4]',
    image: '/Products5.png',
  },
  {
    id: 4,
    tag: 'XYZ-07',
    title: 'Premium Brass Shank Buttons',
    aspectRatio: 'aspect-[16/9]',
    image: '/Products7.png',
  },
];

const rightColumnProducts = [
  {
    id: 5,
    tag: 'XYZ-02',
    title: 'Embossed Metallic Crest Badges',
    aspectRatio: 'aspect-[16/10]',
    image: '/Products2.png',
  },
  {
    id: 6,
    tag: 'XYZ-04',
    title: 'Durable Adjustable Strap Buckles',
    aspectRatio: 'aspect-[3/4]',
    image: '/Products4.png',
  },
  {
    id: 7,
    tag: 'XYZ-06',
    title: 'Woven Cotton Twill Ribbon Tapes',
    aspectRatio: 'aspect-[4/4.5]',
    image: '/Products6.png',
  },
  {
    id: 8,
    tag: 'XYZ-08',
    title: 'Engraved SaRa Textured Rivets',
    aspectRatio: 'aspect-[3/4]',
    image: '/Products8.png',
  },
];

export default function ProductsSection() {
  return (
    <section className="w-full bg-[#f8f7f5] py-20 px-4 sm:px-8 md:px-16 lg:px-28 font-sans">
      <div className="max-w-[1100px] mx-auto space-y-16">
        
        {/* --- Header --- */}
        <div className="text-center space-y-2">
          <div className="text-[13px] sm:text-sm font-bold text-blue-600 tracking-[0.2em] uppercase">
            // OUR PRODUCTS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Maheen Creates <span className="font-serif italic font-normal">All of Your</span>
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            beautiful Products
          </h2>
        </div>

        {/* --- Masonry 2 Column Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col gap-12">
            {leftColumnProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer space-y-3">
                <div className={`w-full bg-slate-200 overflow-hidden ${item.aspectRatio}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-base sm:text-lg font-black text-slate-800 block tracking-wider uppercase">
                    {item.tag}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-12">
            {rightColumnProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer space-y-3">
                <div className={`w-full bg-slate-200 overflow-hidden ${item.aspectRatio}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-base sm:text-lg font-black text-slate-800 block tracking-wider uppercase">
                    {item.tag}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* --- Corner Frame Hover Button --- */}
        <div className="flex justify-center pt-8">
          <button className="relative group inline-flex items-center justify-center gap-6 px-10 py-3.5 bg-[#e5e7e4] text-[#1c1c1c] transition-all duration-300">
            
            {/* Top-Left Corner */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black transition-colors duration-300 group-hover:border-[#166534]" />

            {/* Top-Right Corner */}
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-black transition-colors duration-300 group-hover:border-[#166534]" />

            {/* Bottom-Left Corner */}
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-black transition-colors duration-300 group-hover:border-[#166534]" />

            {/* Bottom-Right Corner */}
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black transition-colors duration-300 group-hover:border-[#166534]" />

            {/* Button Text */}
            <span className="tracking-wide text-base font-medium group-hover:text-[#166534] transition-colors duration-300">
              See More
            </span>

            {/* Diagonal Arrow */}
            <svg
              className="w-4 h-4 text-slate-800 group-hover:text-[#166534] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}