import mongoose, { Schema, model, models } from 'mongoose';

export interface IMember {
  name: string;
  designation: string;
  image: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Member || model<IMember>('Member', MemberSchema);