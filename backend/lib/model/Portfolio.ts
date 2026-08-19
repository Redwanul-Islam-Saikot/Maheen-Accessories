import mongoose, { Schema, model, models } from 'mongoose';

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }, // e.g., 'Customize Button'
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Portfolio = models.Portfolio || model('Portfolio', PortfolioSchema);
export default Portfolio;