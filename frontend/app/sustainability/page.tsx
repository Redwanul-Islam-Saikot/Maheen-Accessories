'use client';

import React from 'react';
import Link from 'next/link';
import { Hammer, ArrowLeft, Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-[80vh] w-full bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
            <Hammer className="w-12 h-12 text-[#805AD5]" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
            <Construction className="w-5 h-5" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Under Development
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We are working hard to bring you something amazing. This page will be available very soon!
          </p>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#805AD5] h-full w-2/3 rounded-full animate-pulse" />
        </div>

        {/* Back to Home Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#805AD5] hover:bg-[#6b46c1] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}