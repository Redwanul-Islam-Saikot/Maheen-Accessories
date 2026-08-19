'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Member {
  _id: string;
  name: string;
  designation: string;
  image: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export default function MembersSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/members', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMembers(data.data);
        } else if (Array.isArray(data)) {
          setMembers(data);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-slate-800" size={32} />
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f8fafc] py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-[1300px] mx-auto space-y-12">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="text-purple-600 font-bold text-xs tracking-wider uppercase">
              06 <span className="text-slate-400 font-normal">//</span> OUR MANAGEMENT
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              Our Core Members
            </h2>
            <p className="text-3xl md:text-4xl font-serif italic text-slate-900">
              Of The Board
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <p className="max-w-md text-right text-slate-500 text-xs md:text-sm leading-relaxed font-normal">
              An extraordinarily talented team of writers, editors, policy experts and designers who share a unified vision for long term sustainability.
            </p>

            {/* Navigation Buttons (Swiper Controls) */}
            {members.length > 3 && (
              <div className="flex items-center gap-2 pt-2">
                <button className="member-prev-btn w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition text-slate-600">
                  <ChevronLeft size={18} />
                </button>
                <button className="member-next-btn w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition text-slate-600">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- Dynamic Member Cards Slider --- */}
        {members.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No members found.</div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              prevEl: '.member-prev-btn',
              nextEl: '.member-next-btn',
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }, // ৩টি কার্ড শো করবে
            }}
            className="w-full py-2"
          >
            {members.map((member) => (
              <SwiperSlide key={member._id} className="h-auto">
                <div className="flex flex-col items-start space-y-4 group h-full">
                  
                  {/* Photo */}
                  <div className="w-full h-[360px] bg-slate-200 overflow-hidden rounded-none">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 w-full">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {member.designation}
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3 pt-2 text-slate-800">
                      
                      {/* Facebook Icon */}
                      <a
                        href={member.facebook || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-purple-600 transition-colors"
                        title="Facebook"
                      >
                        <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </a>

                      {/* Instagram Icon */}
                      <a
                        href={member.instagram || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-purple-600 transition-colors"
                        title="Instagram"
                      >
                        <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>

                      {/* LinkedIn Icon */}
                      <a
                        href={member.linkedin || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-purple-600 transition-colors"
                        title="LinkedIn"
                      >
                        <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </a>

                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
}