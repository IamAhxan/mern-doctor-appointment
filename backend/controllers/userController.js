import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as Cloudinary } from 'cloudinary'
// API Register User

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.json({
                success: false,
                message: 'Missing Details'
            })
        }

        if (!validator.isEmail(email)) {
            res.json({
                success: false,
                message: 'Enter a Valid Email'
            })
        }

        if (password.length < 8) {
            res.json({
                success: false,
                message: 'Enter a Strong Password, min 8 chars'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        return res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: 'User not Found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            return res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: 'Invalid Credientials'
            })
        }


    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')
        res.json({
            success: true,
            userData
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const userId = req.userId
        const imageFile = req.file;
        if (!name || !phone || !dob || !gender) {
            return res.json({
                success: false,
                message: 'Data Missing'
            })
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            // Upload Image to Cloudinary
            const imageUpload = await Cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({
            success: true,
            message: 'Profile Updated'
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export { registerUser, loginUser, getProfile, updateProfile }