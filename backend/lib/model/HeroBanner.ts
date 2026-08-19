import mongoose, { Schema, models, model } from 'mongoose';

const HeroBannerSchema = new Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    primaryBtnText: { type: String, default: '' },
    primaryBtnLink: { type: String, default: '' },
    secondaryBtnText: { type: String, default: '' },
    secondaryBtnLink: { type: String, default: '' },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const HeroBanner = models.HeroBanner || model('HeroBanner', HeroBannerSchema);

export default HeroBanner;