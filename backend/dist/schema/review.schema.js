"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    providerId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
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
}, { timestamps: true });
ReviewSchema.index({ providerId: 1, userId: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)("Review", ReviewSchema);
