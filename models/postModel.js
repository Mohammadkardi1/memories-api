import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    title: { type: String },
    message: { type: String },
    creator: { type: String },
    creatorId: { type: String },
    tags: { type: [String] },
    selectedFile: { type: String },
    likes: { type: [String], default: []},
    public_id: { type: String },
}, {timestamps: true})


const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage