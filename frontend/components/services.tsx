'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/services?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch services');

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setServices(data.data);
      } else if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Failed to load services on frontend:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    router.refresh();
  }, [fetchServices, router]);

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden text-slate-900">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 bg-cover bg-center" 
        style={{ backgroundImage: `url('/texture.png')` }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#52132e] uppercase tracking-widest mb-3">
              01 // SERVICES
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
              Our Core <br />
              <span className="font-semibold text-slate-900">Services</span>
            </h2>
          </div>

          <p className="max-w-md text-xs md:text-sm text-slate-600 leading-relaxed">
            We specialize in developing products that meet <strong className="text-slate-900">world-class standards</strong>, 
            ensuring every detail is perfect to bring your vision to life.
          </p>
        </div>

        {/* Dynamic Services Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[440px] bg-slate-100 rounded-3xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed rounded-3xl">
            No services available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="group relative bg-[#dce1e5]/60 rounded-3xl overflow-hidden h-[440px] transition-all duration-500 hover:shadow-2xl flex flex-col justify-end cursor-pointer border border-slate-200/60 hover:border-transparent"
              >
                {/* 1. Main Image (হোভার করলেও ছবি থেকে যাবে, একটু জুম ও হাল্কা ব্রাইটনেস সামঞ্জস্য হবে) */}
                <img
                  src={service.imageUrl || '/placeholder.png'}
                  alt={service.title || 'Service Image'}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />

                {/* 2. Normal Gradient Overlay (ডিফল্ট অবস্থায় নিচের দিকে কালো গ্রাডিয়েন্ট) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-10" />

                {/* 3. Default Bottom Title & Number */}
                <div className="absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 group-hover:opacity-0 z-10">
                  <span className="text-3xl font-bold text-white block mb-1">
                    {service.serviceNumber}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {service.title}
                  </h3>
                </div>

                {/* 4. Hover Color Overlay (ইমেজের ওপর সেমি-ট্রান্সপারেন্ট কালার কালার লেয়ার) */}
                {/* আপনি চাইলে bg-[#52132e]/85 বা bg-[#0f172a]/85 দিয়ে আপনার পছন্দমতো কালার টোন পরিবর্তন করতে পারেন */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#52132e]/90 via-[#2d0a19]/85 to-[#0f172a]/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8 z-20">
                  
                  {/* Wave Texture Inside Hover Card */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20 invert filter bg-cover bg-center"
                    style={{ backgroundImage: `url('/texture.png')` }}
                  />

                  {/* Top Number */}
                  <div className="relative z-10">
                    <span className="text-4xl font-light text-rose-200/80 font-mono block">
                      {service.serviceNumber}
                    </span>
                  </div>

                  {/* Middle Title & Description */}
                  <div className="relative z-10 space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-semibold text-white leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-200 leading-relaxed line-clamp-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Link Button */}
                  <div className="relative z-10 pt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <Link
                      href={service.link || '#'}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-rose-200 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Discover Work &rarr;
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}