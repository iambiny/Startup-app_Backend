import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { StartupModel } from './models/Startup.js';
import { AuthorModel } from './models/Author.js';
import { PlaylistModel } from './models/Playlist.js';
import cors from 'cors';
import 'dotenv/config';
const app = express();
const PORT = 8000;
const MONGODB_URI = process.env.MONGODB_URI || '';
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: 'https://startup-app-fawn.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.get('/', (req, res) => {
    res.json("hello world");
});
// get all posts
app.get('/api/startups', async (req, res) => {
    const searchQuery = req.query.searchQuery || '';
    try {
        const startups = await StartupModel.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        })
            .populate({
            path: 'author',
            select: '_id name image',
            model: AuthorModel
        }).exec();
        res.json(startups);
    }
    catch (error) {
        console.log(error);
    }
});
// get all posts by user/author
app.get('/api/user/getPosts/:id', async (req, res) => {
    const authodId = req.params.id;
    try {
        const startups = await StartupModel.find({ author: authodId })
            .populate({
            path: 'author',
            select: '_id name image',
            model: AuthorModel
        })
            .exec();
        res.json(startups);
    }
    catch (error) {
        console.log(error);
    }
});
// get all posts by playlist
app.get('/api/startups/getRelatedPosts/:playlist', async (req, res) => {
    const playlist = req.params.playlist;
    try {
        const postIdsByPlaylist = await PlaylistModel.findOne({ title: playlist })
            .populate({
            path: 'select',
            populate: {
                path: 'author', // Populate trường 'author' từ StartupModel
                model: AuthorModel,
            },
        })
            .exec();
        res.json(postIdsByPlaylist?.select);
    }
    catch (error) {
        console.log(error);
    }
});
// get detail post
app.get('/api/startups/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Update views when a user access to detail post page
        const detailPost = await StartupModel.findById(id)
            .populate({
            path: 'author',
            select: '_id name username image bio',
            model: AuthorModel
        })
            .exec();
        res.json(detailPost);
    }
    catch (error) {
        console.log(error);
    }
});
// get views of post
app.get('/api/startups/views/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const viewsOfPost = await StartupModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .select(['views'])
            .exec();
        res.json(viewsOfPost);
    }
    catch (error) {
        console.log(error);
    }
});
// Check if user (signIn by GitHub) has 'author' in db?
app.get('/api/user/checkHasAuthor/:id', async (req, res) => {
    const githubId = req.params.id;
    try {
        const isExistAuthor = await AuthorModel.findOne({ id: githubId }).exec();
        res.json(isExistAuthor);
    }
    catch (error) {
        console.log(error);
    }
});
// get details of user
app.get('/api/user/getProfile/:id', async (req, res) => {
    const authorId = req.params.id;
    try {
        const author = await AuthorModel.findOne({ _id: authorId }).exec();
        res.json(author);
    }
    catch (error) {
        console.log(error);
    }
});
// Create author by user
app.post('/api/user/createAuthor', async (req, res) => {
    const { id, name, username, email, bio, image } = req.body;
    console.log(req.body);
    try {
        await AuthorModel.create({
            id, name, username, email, image, bio
        });
        res.json({ "message": "Successfull" });
    }
    catch (error) {
        console.log(error);
    }
});
// Create a new startup post
app.post('/api/startup/createPost', async (req, res) => {
    const { title, description, category, image, author, details } = req.body;
    try {
        const result = await StartupModel.create({
            title, description, author, category, image, details
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
});
// Connect to db and load server if success
try {
    await mongoose.connect(MONGODB_URI);
    console.log('App connected to mongdb');
    app.listen(PORT, () => {
        console.log(`App is listening to port: http://localhost:${PORT}`);
    });
}
catch (error) {
    console.log(error);
}
