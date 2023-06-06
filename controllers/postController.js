import mongoose from "mongoose"
import PostMessage from "../models/postModel.js"
import cloudinary from 'cloudinary';








// create post 
export const createPost = async (req, res) => {
    const newPost = new PostMessage(req.body)
    try {
        await newPost.save()
        res.status(201).json({data: newPost})
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// get posts
export const getAllPosts = async (req, res) => {
    const { page } = req.query
    const LIMIT = 8
    const startIndex = (Number(page) - 1) * LIMIT
    try {
        const total = await PostMessage.countDocuments({})
        // get the newest posts first
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        res.status(200).json({data: posts, 
            currentPage: Number(page), 
            numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


// get posts
export const getPost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No post with that ID')
    } 
    try {
        const post = await PostMessage.findById(req.params.id)
        res.status(200).json({data: post})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

// delete post 
export const deletePost = async (req, res) => {
    // Set up Cloudinary configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_KEY_SECRET
      })
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No post with that ID')
    } 
    try {
        const post = await PostMessage.findById(req.params.id);
        const imgPublicId = post.public_id
        if (imgPublicId) {
            await cloudinary.uploader.destroy(imgPublicId, function(error, result) {
                if (error) {
                  console.log('Error deleting image:', error);
                } else {
                  console.log('Image deleted:', result);
                }
              });
        }
        const deletedPost = await PostMessage.findByIdAndDelete(req.params.id)
        res.status(200).json({data: deletedPost})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// Like post 
export const likePost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No post with that ID')
    }
    try {
        const post = await PostMessage.findById(req.params.id)
        const index = post.likes.findIndex((id) => id === String(req.userId))
        if (index === -1 ) {
            post.likes.push(req.userId)
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId))
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(req.params.id, post, {new: true})
        res.status(200).json({data: updatedPost})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// get posts by search
export const getPostsBySearch = async (req, res) => {
    const {searchQuery} = req.query
    // the 'i' option is used to create a case-insensitive regular expression.
    const title = new RegExp(searchQuery, 'i')
    try {
        const posts = await PostMessage.find({ 
            $or : [
                {title},
                {tags: {$elemMatch: { $regex: searchQuery }}}
            ]})
        res.status(200).json({data:posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}