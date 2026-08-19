'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface BlogItem {
  _id: string;
  title: string;
  dateBadge: string;
  imageUrl: string;
}

export default function OurActivitySection() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        } else if (Array.isArray(data)) {
          setBlogs(data);
        }
      } catch (err) {
        console.error('Failed to load activity blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-8 md:px-12 lg:px-20 font-sans">
      <div className="max-w-[1240px] mx-auto space-y-10">
        
        {/* --- Top Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[12px] sm:text-[13px] font-bold text-blue-600 tracking-[0.2em] uppercase">
              07 // LATEST NEWS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1">
              Our Activity
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-slate-700">
              Related Blog
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md text-left md:text-right leading-relaxed font-normal">
            we're deeply passionate to catch your lovely memories in cameras and convey your love for every moment of life as a whole.
          </p>
        </div>

        {/* --- Activity Cards Grid --- */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((item) => (
              <div
                key={item._id}
                className="group border border-slate-300 p-3 sm:p-4 bg-white transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Image Container with Date Badge */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2.5 left-2.5 bg-[#7152f3] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 tracking-wider uppercase">
                      {item.dateBadge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[44px]">
                    {item.title}
                  </h3>
                </div>

                {/* Read More Link */}
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-[#7152f3] transition-colors"
                  >
                    Read More <span className="text-sm">&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Styled "See More" Button with Border Line Attached --- */}
        <div className="flex justify-center pt-6">
          <button className="group relative bg-[#e2e8e5] text-[#000000] px-10 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:text-[#004d3d] flex items-center gap-6 shadow-sm active:scale-95">
            {/* Top-Left Corner Frame */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />

            {/* Bottom-Left Corner Frame */}
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />

            {/* Top-Right Corner Frame */}
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />

            {/* Bottom-Right Corner Frame */}
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-900 group-hover:border-[#004d3d] transition-colors" />

            <span>See More</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

      </div>
    </section>
  );
}