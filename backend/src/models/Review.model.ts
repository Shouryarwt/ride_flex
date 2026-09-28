import mongoose, { Schema } from 'mongoose';
import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  booking: Types.ObjectId;
  vehicle: Types.ObjectId;
  rating: number;
  comment?: string;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ vehicle: 1, createdAt: -1 });
reviewSchema.index({ user: 1, vehicle: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
