'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

export default function PortfolioSection() {
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setItems(data.data);
        }
      } catch (err) {
        console.error('Failed to load portfolio items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (loading || items.length === 0) return null;

  // 3-Card Circular Array Logic
  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  const nextIndex = (currentIndex + 1) % items.length;

  const leftItem = items[prevIndex];
  const centerItem = items[currentIndex];
  const rightItem = items[nextIndex];

  return (
    <section className="relative w-full py-28 bg-white overflow-hidden text-slate-900 select-none">
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        
        {/* Top Header Section */}
        <div className="text-center space-y-2 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            02 // PORTFOLIO
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-slate-900">
            Collection of photos <span className="font-serif italic text-slate-600">All of Our</span> <br />
            <span className="font-bold">Best Works</span>
          </h2>
        </div>

        {/* Portfolio Carousel Container */}
        <div className="relative min-h-[440px] md:min-h-[520px] flex items-center justify-center">
          
          {/* Main 3 Cards Container (কার্ডের সাইজ আগের চেয়ে অনেক বড় করা হয়েছে) */}
          <div className="relative w-full flex items-center justify-center gap-3 md:gap-8 z-20">
            
            {/* Left Image Card */}
            <div className="hidden sm:block w-[280px] md:w-[360px] lg:w-[420px] h-[300px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-all duration-500">
              <img
                src={leftItem.image}
                alt={leftItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Left Slider Arrow Button */}
            <button
              onClick={handlePrev}
              className="z-30 p-2 text-slate-900 hover:scale-125 transition-transform cursor-pointer"
              aria-label="Previous image"
            >
              <ArrowLeft size={32} strokeWidth={1.8} />
            </button>

            {/* Center Main Featured Card (সবচেয়ে বড় ও ফোকাসড) */}
            <div className="relative w-[360px] sm:w-[560px] lg:w-[680px] h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 z-30 transition-all duration-500">
              <img
                src={centerItem.image}
                alt={centerItem.title}
                className="w-full h-full object-cover"
              />

              {/* Top-Right Circle Arrow Action Button */}
              <div className="absolute top-6 right-6 z-20">
                <button className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                  <ChevronRight size={22} className="text-slate-800 ml-0.5" />
                </button>
              </div>

              {/* Bottom-Left Title & Brand Overlay */}
              <div className="absolute bottom-6 left-6 z-20 text-slate-900 bg-white/45 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/50">
                <h3 className="text-xl font-bold leading-tight">
                  {centerItem.title || 'Customize Button'}
                </h3>
                <p className="text-[11px] font-semibold tracking-wider text-slate-800 uppercase mt-0.5">
                  {centerItem.subtitle || 'BY MAHEEN ACCESSORIES LIMITED.'}
                </p>
              </div>
            </div>

            {/* Right Slider Arrow Button */}
            <button
              onClick={handleNext}
              className="z-30 p-2 text-slate-900 hover:scale-125 transition-transform cursor-pointer"
              aria-label="Next image"
            >
              <ArrowRight size={32} strokeWidth={1.8} />
            </button>

            {/* Right Image Card */}
            <div className="hidden sm:block w-[280px] md:w-[360px] lg:w-[420px] h-[300px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-all duration-500">
              <img
                src={rightItem.image}
                alt={rightItem.title}
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* PORTFOLIO Watermark: আরেকটু বড়, আরও ডার্ক ও কিছুটা নিচের দিকে নামানো হয়েছে (translate-y-8) */}
          <div className="absolute inset-x-0 bottom-[-20px] md:bottom-[-40px] pointer-events-none z-10 w-full flex justify-center overflow-hidden">
            <h1 className="text-[140px] sm:text-[220px] md:text-[280px] lg:text-[340px] font-serif font-extrabold text-[#33373b]/45 tracking-tight leading-none whitespace-nowrap">
              PORTFOLIO
            </h1>
          </div>

        </div>

      </div>
    </section>
  );
}