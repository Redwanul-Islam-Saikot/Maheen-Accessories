'use client';

import React from 'react';
import Link from 'next/link';

export default function WhyChooseUs() {
  const features = [
    { id: 1, title: '20+ Years Experience', icon: '→', active: true },
    { id: 2, title: 'Creative Custom Design', icon: '↗', active: false },
    { id: 3, title: 'Globally Awarded', icon: '↗', active: false },
    { id: 4, title: 'Best Quality With Price', icon: '→', active: true },
  ];

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Header & Feature Accordion/List */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Subtitle with Blue Gradient */}
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent uppercase block">
              04 // OUR FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Why choose Us
            </h2>
          </div>

          {/* Features List */}
          <div className="space-y-0 border-t border-slate-100">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center gap-6 py-4 border-b border-slate-200 transition-all duration-300 cursor-pointer group"
              >
                <span className={`text-base font-normal ${feature.active ? 'text-blue-400' : 'text-slate-800'}`}>
                  {feature.icon}
                </span>
                <span
                  className={`text-base sm:text-lg tracking-wide ${
                    feature.active
                      ? 'text-[#9ab7ea] font-medium'
                      : 'text-slate-900 font-semibold group-hover:text-blue-600'
                  }`}
                >
                  {feature.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Building Image + Overlapping Dark Card + Bottom Right Counters */}
        <div className="lg:col-span-7 relative pt-6 lg:pt-0">
          
          {/* Main Building Image Container */}
          <div className="relative w-full overflow-hidden aspect-[16/9] bg-slate-100 shadow-sm">
            <img
              src="/building.jpg" // Apnar building image er path din
              alt="Maheen Building"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Dark Card - Positioned Lower (top-[65%]) */}
          <div className="relative lg:absolute lg:-left-20 xl:-left-24 lg:top-[65%] lg:-translate-y-1/2 mt-6 lg:mt-0 w-full lg:w-[380px] xl:w-[420px] bg-[#111111] text-white p-8 sm:p-10 z-20 space-y-6 shadow-2xl rounded-sm">
            
            {/* Logo Image */}
            <div className="w-48 sm:w-56 h-auto">
              <img
                src="/logo.png" // Apnar logo image er path din (Frame 3.png)
                alt="MAHEEN ACCESSORIES ltd."
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal tracking-wide">
              Maheen Accessories Ltd has been serving for 20 years, since its establishment in 2005. They have built a reputation for providing high-quality accessories and exceptional service over the past two decades.
            </p>

            {/* Read More Link */}
            <div className="pt-2">
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 hover:text-white font-medium transition-colors group"
              >
                <span>Read More</span>
                <span className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Floating Counter Cards with Gap (Bottom Right Corner - Overlapping Image) */}
          <div className="flex justify-end gap-4 mt-4 lg:mt-0 lg:absolute lg:bottom-0 lg:right-0 z-20">
            
            {/* White Counter Card */}
            <div className="bg-white text-slate-900 px-6 py-5 min-w-[130px] sm:min-w-[150px] text-center shadow-lg rounded-sm border border-slate-100">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                500+
              </h3>
              <p className="text-[11px] font-semibold text-slate-800 tracking-wider mt-1">
                Designs
              </p>
            </div>

            {/* Cyan Counter Card */}
            <div className="bg-[#8ee0f8] text-slate-900 px-6 py-5 min-w-[130px] sm:min-w-[150px] text-center shadow-lg rounded-sm">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                3000k
              </h3>
              <p className="text-[11px] font-bold text-slate-900 tracking-wider mt-1">
                Order Covered
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}