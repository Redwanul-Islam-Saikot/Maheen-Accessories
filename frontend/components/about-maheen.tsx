'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AboutData {
  _id?: string;
  subTitle?: string;
  headingPart1?: string;
  headingItalic?: string;
  headingSubtext?: string;
  badgeText?: string;
  badgeLink?: string;
  sectionLabel?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  circleBadgeText?: string;
  circleBadgeLink?: string;
  imageUrl?: string;
}

export default function AboutMaheen() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // dynamic cache prevention using timestamp
        const res = await fetch(`/api/about-maheen?t=${Date.now()}`, { 
          cache: 'no-store' 
        });
        const resData = await res.json();
        
        if (resData.success && resData.data) {
          // API থেকে Array আসলেও প্রথম অবজেক্টটি হ্যান্ডেল করবে
          if (Array.isArray(resData.data)) {
            setData(resData.data[0] || null);
          } else {
            setData(resData.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch About Maheen dynamic data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // API থেকে ডেটা লোড হওয়া পর্যন্ত Spinner দেখাবে
  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center bg-white">
        <div className="w-8 h-8 border-4 border-[#52132e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ডাটা না থাকলে কিছু রেন্ডার হবে না
  if (!data) return null;

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dynamic Top Header Part */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            {data.subTitle && (
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">
                {data.subTitle}
              </span>
            )}
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              {data.headingPart1}{' '}
              {data.headingItalic && (
                <span className="font-serif italic font-normal text-slate-600">
                  {data.headingItalic}
                </span>
              )}
            </h2>

            {data.headingSubtext && (
              <p className="text-slate-500 text-sm sm:text-base font-normal">
                {data.headingSubtext}
              </p>
            )}
          </div>

          {/* Animated Corner-Bracket Hover "Explore Now" Button */}
          {data.badgeText && (
            <div className="self-start">
              <Link
                href={data.badgeLink || '#'}
                className="relative inline-flex items-center justify-center p-2 group cursor-pointer select-none"
              >
                {/* Top-Left Corner Bracket */}
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-slate-900 transition-all duration-300 ease-out group-hover:border-emerald-700 group-hover:-top-1 group-hover:-left-1 group-hover:w-1/2 group-hover:h-1/2 pointer-events-none" />

                {/* Top-Right Corner Bracket */}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-slate-900 transition-all duration-300 ease-out group-hover:border-emerald-700 group-hover:-top-1 group-hover:-right-1 group-hover:w-1/2 group-hover:h-1/2 pointer-events-none" />

                {/* Bottom-Left Corner Bracket */}
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-slate-900 transition-all duration-300 ease-out group-hover:border-emerald-700 group-hover:-bottom-1 group-hover:-left-1 group-hover:w-1/2 group-hover:h-1/2 pointer-events-none" />

                {/* Bottom-Right Corner Bracket */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-slate-900 transition-all duration-300 ease-out group-hover:border-emerald-700 group-hover:-bottom-1 group-hover:-right-1 group-hover:w-1/2 group-hover:h-1/2 pointer-events-none" />

                {/* Inner Button Content */}
                <div className="bg-[#e8e8e8] text-slate-900 group-hover:text-emerald-700 px-6 py-2.5 text-xs font-semibold tracking-wider flex items-center gap-3 transition-colors duration-300">
                  <span>{data.badgeText}</span>
                  <span className="text-sm font-normal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Dynamic Bottom Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Image & Circle Badge Area */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] w-full bg-slate-100">
              {data.imageUrl && (
                <img
                  src={data.imageUrl}
                  alt={data.title || "About Maheen"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Floating Circle Badge */}
            {data.circleBadgeText && (
              <Link
                href={data.circleBadgeLink || '#'}
                className="absolute -bottom-6 -right-4 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-400 to-blue-300 text-white flex items-center justify-center font-bold text-xs shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 z-10"
              >
                <span className="flex items-center gap-1 p-2 text-center">
                  {data.circleBadgeText} <span>↗</span>
                </span>
              </Link>
            )}
          </div>

          {/* Details Text Area */}
          <div className="lg:col-span-6 space-y-4 lg:pl-6">
            {data.sectionLabel && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                  {data.sectionLabel}
                </span>
                <div className="h-[1px] w-20 bg-slate-300" />
              </div>
            )}

            {data.title && (
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-snug">
                {data.title}
              </h3>
            )}

            <div className="space-y-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {data.paragraph1 && <p>{data.paragraph1}</p>}
              {data.paragraph2 && <p>{data.paragraph2}</p>}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}