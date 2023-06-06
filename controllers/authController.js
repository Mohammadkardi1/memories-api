import mongoose from "mongoose";
import user from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const login = async (req, res) => { 
    try {
        const existingUser = await user.findOne({email : req.body.email})
        if (!existingUser) {
            return res.status(404).json({message: "User does't exist"})
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Password"})
        }
        // creates a JSON Web Token (JWT)
        const token = jwt.sign(
            {id: existingUser._id}, 
            process.env.JWT_SECRET
            ,{expiresIn: '1h'}
            )
        res.status(200).json({...existingUser._doc, token})
    } catch (error) {
        res.status(500).json({message: 'Something went wrong!'})
    }
}



export const signup = async (req, res) => {
    const {email, password, name } = req.body
    try {
        const existingUser = await user.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: 'User already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await user.create({
            email,
            password: hashPassword,
            name
        })
        const token = jwt.sign(
            {id: newUser._id}, 
            process.env.JWT_SECRET
            ,{expiresIn: '1h'}
            )


        res.status(200).json({...newUser._doc, token})    
    } catch (error) {
        res.status(500).json({message: 'Something went wrong!'})
    }
}