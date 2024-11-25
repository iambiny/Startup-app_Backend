import mongoose from "mongoose";
import { AuthorModel } from "./Author.js";
const StartupSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: AuthorModel
    },
    views: {
        type: Number,
        default: 0
    },
    description: String,
    category: String,
    image: String,
    details: String,
}, {
    timestamps: true
});
export const StartupModel = mongoose.model('startup', StartupSchema, 'Startup');
