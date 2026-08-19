'use client';

import React, { useState } from 'react';

// Hardcoded 3 Testimonials Data with 5, 4.5, and 4 rating values
const testimonials = [
  {
    id: 1,
    rating: 5,
    quote:
      '"Superior buttons and exceptional service. Thank you, Maheen Accessories!"',
    name: 'Mr. Mahabub Hasan',
    designation: 'Manager Merchandising, Jamuna Denims',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    rating: 4.5,
    quote:
      '"Unmatched quality in metal trims and labels. Always on-time delivery for our export orders."',
    name: 'Ms. Farhana Rahman',
    designation: 'Senior Merchandiser, Envoy Textiles',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    rating: 4,
    quote:
      '"Great design variety and premium finish. Maheen Accessories has been our most trusted partner for years."',
    name: 'Mr. Tanvir Ahmed',
    designation: 'Production Head, Ha-Meem Group',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  // Helper function to render full, half, or empty stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;

      if (rating >= starValue) {
        // Full Star
        return (
          <svg
            key={index}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (rating >= starValue - 0.5) {
        // Half Star
        return (
          <svg
            key={index}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5v-14.8z" />
            <path
              d="M12 2l-2.4 7.4h-7.6l6.2 4.5-2.4 7.4 6.2-4.5 6.2 4.5-2.4-7.4 6.2-4.5h-7.6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        );
      } else {
        // Empty Star
        return (
          <svg
            key={index}
            className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    });
  };

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[600px] flex items-center justify-start py-16 px-4 sm:px-8 md:px-16 lg:px-28 font-sans overflow-hidden">
      {/* --- Background Image with Dark Overlay --- */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('/Background.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] w-full mx-auto">
        {/* --- Testimonial Card --- */}
        <div className="w-full max-w-[620px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-white transition-all duration-500">
          
          {/* --- Dynamic Star Rating --- */}
          <div className="flex items-center gap-1.5 text-sky-400">
            {renderStars(current.rating)}
          </div>

          {/* --- Review Quote --- */}
          <p className="text-lg sm:text-2xl font-light leading-relaxed text-slate-100 min-h-[90px] flex items-center">
            {current.quote}
          </p>

          {/* --- Author Details & Controls --- */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-4 flex-wrap">
            {/* User Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {current.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {current.designation}
                </p>
              </div>
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
              >
                →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}