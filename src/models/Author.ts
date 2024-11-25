import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    id: String,     // GitHubID, ...
    name: String,
    username: String,
    email: String,
    image: String,
    bio: String
});

export const AuthorModel = mongoose.model('author', AuthorSchema, 'Author');