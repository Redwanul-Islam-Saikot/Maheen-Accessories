// models/Partner.ts
import mongoose, { Schema, model, models } from 'mongoose';

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Partner || model('Partner', PartnerSchema);