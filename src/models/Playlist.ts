import mongoose from "mongoose";
import { AuthorModel } from "./Author.js";
import { StartupModel } from "./Startup.js";

const PlaylistSchema = new mongoose.Schema(
    {
        title: String,
        select: {
            type: Array<mongoose.Types.ObjectId>,
            ref: StartupModel
        }
    }
);

export const PlaylistModel = mongoose.model('playlist', PlaylistSchema, 'Playlist');