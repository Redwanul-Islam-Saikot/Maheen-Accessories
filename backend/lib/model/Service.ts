import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema(
  {
    serviceNumber: { type: String, required: true }, // e.g., '01', '02'
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

const Service = models.Service || model('Service', ServiceSchema);

export default Service;