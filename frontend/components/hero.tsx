'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

// Custom SVG Social Icons (Fixes lucide-react build error)
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const renderSocialIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <FacebookIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'linkedin':
      return <LinkedinIcon />;
    default:
      return <FacebookIcon />;
  }
};

export default function HeroSlider() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/hero-banners', {
        cache: 'no-store',
      });

      if (!res.ok) {
        setBanners([]);
        return;
      }

      const data = await res.json();
      const bannerList = data.data || data.banners || (Array.isArray(data) ? data : []);
      
      if (Array.isArray(bannerList)) {
        setBanners(bannerList);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Failed to fetch hero banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-[650px] md:h-[750px] bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-8 w-64 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[650px] md:h-[750px] bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-2">
        <p className="text-base font-semibold text-white">No Hero Banner Added</p>
        <p className="text-xs text-slate-400">Please add hero banners from Admin Panel.</p>
      </div>
    );
  }

  const current = banners[currentIndex];

  return (
    <section className="relative w-full h-[650px] md:h-[750px] bg-black text-white overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.imageUrl || current.image || '/placeholder.jpg'}
          alt={current.title || 'Hero Banner'}
          className="w-full h-full object-cover opacity-75 transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
        <div className="max-w-2xl space-y-6 pt-12">
          {current.tagline && (
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-slate-300 uppercase">
              {current.tagline}
            </p>
          )}

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
            {current.title}
          </h1>

          {current.description && (
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
              {current.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 pt-4">
            {(current.primaryBtnText || current.buttonText) && (
              <a
                href={current.primaryBtnLink || current.buttonLink || '#'}
                className="flex items-center gap-3 bg-[#98d2e6] hover:bg-[#85c3d8] text-slate-950 font-medium text-xs px-7 py-3.5 transition-all"
              >
                <span>{current.primaryBtnText || current.buttonText}</span>
                <ArrowUpRight size={16} />
              </a>
            )}

            {current.secondaryBtnText && (
              <a
                href={current.secondaryBtnLink || '#'}
                className="relative flex items-center gap-3 border border-white/40 bg-black/20 hover:bg-white/10 text-white font-medium text-xs px-7 py-3.5 transition-all"
              >
                <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-white" />
                <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-white" />

                <span>{current.secondaryBtnText}</span>
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Right Social Links */}
        <div className="hidden lg:flex flex-col items-center gap-4 z-20">
          {Array.isArray(current.socialLinks) && current.socialLinks.length > 0 ? (
            current.socialLinks.map((social: any, idx: number) => (
              <a
                key={idx}
                href={social.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all"
              >
                {renderSocialIcon(social.platform)}
              </a>
            ))
          ) : (
            <>
              <a href="#" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all">
                <FacebookIcon />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all">
                <InstagramIcon />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all">
                <LinkedinIcon />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Slider Controls */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-8">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="text-[11px] font-semibold tracking-widest text-slate-300 hover:text-white transition-colors uppercase"
          >
            PREV
          </button>

          <div className="flex items-center gap-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="flex items-center justify-center"
              >
                {idx === currentIndex ? (
                  <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 bg-white/40 hover:bg-white rounded-full transition-all" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
            className="text-[11px] font-semibold tracking-widest text-slate-300 hover:text-white transition-colors uppercase"
          >
            NEXT
          </button>
        </div>
      )}
    </section>
  );
}