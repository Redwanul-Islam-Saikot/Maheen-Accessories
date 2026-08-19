import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  policyNumber: string; // e.g., "01", "02"
  title: string;
  description?: string;
  iconUrl: string;
  pdfUrl?: string;
  createdAt: Date;
}

const PolicySchema: Schema = new Schema(
  {
    policyNumber: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    iconUrl: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);