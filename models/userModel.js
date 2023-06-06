import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: { required: true, type: String },
    email: { required: true, type: String },
    password: { required: true, type: String },
    // picture: { type: String },
    // sub: { type: Number },
    // jti: { type: Number }
})


const user = mongoose.model('user', userSchema)

export default user