import mongoose from "mongoose";
import { StartupModel } from "./Startup.js";
const PlaylistSchema = new mongoose.Schema({
    title: String,
    select: {
        type: (Array),
        ref: StartupModel
    }
});
export const PlaylistModel = mongoose.model('playlist', PlaylistSchema, 'Playlist');
