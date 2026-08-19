'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface Policy {
  _id?: string;
  id?: string;
  title: string;
  category?: string;
  shortDesc?: string;
  content?: string;
  iconUrl?: string;
  icon?: string;
  docUrl?: string;
}

export default function PoliciesSection() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/policies', { cache: 'no-store' });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (data.success && Array.isArray(data.data)) {
          setPolicies(data.data);
        } else if (Array.isArray(data)) {
          setPolicies(data);
        } else {
          setPolicies([]);
        }
      } catch (error) {
        console.error('Failed to fetch public policies:', error);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin text-slate-800" size={28} />
        <span className="font-medium text-sm">Policies Loading...</span>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-12 px-6 md:px-12 lg:px-16 font-sans">
      <div className="max-w-[1300px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-purple-600 font-bold text-xs tracking-wider uppercase mb-2">
              05 <span className="text-slate-400 font-normal">//</span> POLICIES
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              Our Smart
            </h2>
            <p className="text-3xl md:text-4xl font-serif italic text-slate-900 mt-1">
              Policies
            </p>
          </div>

          <div className="max-w-md text-right text-slate-700 text-xs md:text-sm leading-relaxed font-normal">
            we’re deeply passionate <span className="font-semibold text-slate-900">catch your lovely memories in cameras</span> and
            <br className="hidden sm:inline" />
            Convey your love for every moment of life as a whole.
          </div>
        </div>

        {/* --- Policy Cards Grid --- */}
        {policies.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No policies found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {policies.map((item, index) => {
              const serialNumber = String(index + 1).padStart(2, '0');
              const iconImage = item.iconUrl || item.icon;

              // ৫ম নম্বর কার্ড (index === 4) থেকে col-start-2 হবে,
              // যার ফলে 05 ও 06 কার্ড দুটি ৩ এবং ৪ নম্বর কলামে বসবে (Figma Layout অনুযায়ী)।
              const isFifthCard = index === 4;

              return (
                <div
                  key={item._id || item.id || index}
                  className={`group relative w-full bg-[#E8E8E8] hover:bg-white border border-slate-200/80 p-6 h-[380px] flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl ${
                    isFifthCard ? 'lg:col-start-2' : ''
                  }`}
                >
                  {/* --- Dynamic 4 Corner Black Borders --- */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-900 z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2" />
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-900 z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-900 z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2" />
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-900 z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />

                  {/* --- Top Content (Icon) --- */}
                  <div className="w-12 h-12 flex items-center justify-start flex-shrink-0">
                    {iconImage ? (
                      <img
                        src={iconImage}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ShieldCheck size={44} className="text-slate-900" />
                    )}
                  </div>

                  {/* --- Bottom Content Wrapper --- */}
                  <div className="space-y-2">
                    
                    {/* Serial Number & Title */}
                    <div className="space-y-1">
                      <div className="text-slate-500 text-xs font-semibold tracking-wider">
                        {serialNumber}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Description & Link (Hover এ স্লাইড হয়ে প্রকাশ পাবে) */}
                    <div className="max-h-0 opacity-0 group-hover:max-h-[180px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden space-y-3 pt-1">
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {item.shortDesc || item.content || 'We build digital strategies, products and services appreciated by clients.'}
                      </p>

                      <a
                        href={item.docUrl || '#'}
                        target={item.docUrl ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-purple-700 transition-colors group/link pt-0.5"
                      >
                        <span>Discover Work</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                      </a>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}