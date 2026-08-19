import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutMaheen extends Document {
  subTitle: string;
  headingPart1: string;
  headingItalic: string;
  headingSubtext: string;
  badgeText: string;
  sectionLabel: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  circleBadgeText: string;
  imageUrl: string;
}

const AboutMaheenSchema = new Schema<IAboutMaheen>(
  {
    subTitle: { type: String, default: '' },
    headingPart1: { type: String, default: '' },
    headingItalic: { type: String, default: '' },
    headingSubtext: { type: String, default: '' },
    badgeText: { type: String, default: '' },
    sectionLabel: { type: String, default: '' },
    title: { type: String, default: '' },
    paragraph1: { type: String, default: '' },
    paragraph2: { type: String, default: '' },
    circleBadgeText: { type: String, default: '' },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AboutMaheen || mongoose.model<IAboutMaheen>('AboutMaheen', AboutMaheenSchema);