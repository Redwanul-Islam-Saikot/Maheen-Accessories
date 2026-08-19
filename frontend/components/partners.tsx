'use client';

import React, { useEffect, useState } from 'react';

interface Partner {
  _id: string;
  name: string;
  logoUrl: string;
}

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data);
        } else if (Array.isArray(data)) {
          setPartners(data);
        } else {
          setPartners([]);
        }
      } catch (err) {
        console.error('Failed to load partners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8 md:px-16 lg:px-28 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* --- Header --- */}
        <div className="text-center space-y-2">
          <div className="text-[13px] sm:text-sm font-bold text-blue-600 tracking-[0.2em] uppercase">
            06// OUR PARTNERS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Meet Our <span className="font-serif italic font-normal">Working</span>
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Partners
          </h2>
        </div>

        {/* --- Partners Grid --- */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-center">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="group relative w-full aspect-[4/3] sm:aspect-[1/1] md:aspect-[4/3] border border-slate-300 p-0 flex items-center justify-center bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-300"
              >
                {/* Background Purple Overlay */}
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                {/* Original Color Logo + Light Purple Shift on Hover */}
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:sepia-[0.3] group-hover:hue-rotate-[240deg] group-hover:saturate-200"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}