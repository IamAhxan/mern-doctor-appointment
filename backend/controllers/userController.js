import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

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

        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            succes: false,
            message: error.message
        })
    }
}

export { registerUser }