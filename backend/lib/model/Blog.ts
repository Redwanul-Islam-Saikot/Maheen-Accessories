import mongoose, { Schema, model, models } from 'mongoose';

export interface IBlog {
  _id?: string;
  title: string;
  dateBadge: string; // e.g. "20-22 SEP 2023"
  imageUrl: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    dateBadge: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Blog = models.Blog || model<IBlog>('Blog', BlogSchema);
export default Blog;