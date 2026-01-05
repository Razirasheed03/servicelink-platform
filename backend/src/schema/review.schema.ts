import { Schema, model, Types } from "mongoose";

const ReviewSchema = new Schema(
  {
    providerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
		reply: {
			comment: {
				type: String,
				trim: true,
				maxlength: 500,
			},
			updatedAt: {
				type: Date,
			},
		},
  },
  { timestamps: true }
);

ReviewSchema.index({ providerId: 1, userId: 1 }, { unique: true });

export const Review = model("Review", ReviewSchema);
