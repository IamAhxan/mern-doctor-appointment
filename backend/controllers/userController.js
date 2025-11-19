import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import { v2 as Cloudinary } from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'



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

// Appointment Booking API
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({
                success: false,
                message: 'Doctor is unavailable'
            })
        }

        // Clone slots_booked
        let slots_booked = { ...docData.slots_booked }

        // Create date key if not exists
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = []
        }

        // Check if slot already booked
        if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: 'Slot not Available' })
        }

        // Add new booked slot
        slots_booked[slotDate].push(slotTime)

        // Get user data
        const userData = await userModel.findById(userId).select("-password")

        // Clean doctor data for appointment
        const cleanDocData = { ...docData._doc }
        delete cleanDocData.slots_booked
        delete cleanDocData.password

        // Save appointment
        const appointmentData = {
            userId,
            docId,
            userData,
            docData: cleanDocData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        return res.json({
            success: true,
            message: 'Appointment Booked'
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })
        return res.json({
            success: true,
            appointments
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// Cancel Appointment

const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: "Unauthorized Action"
            })
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const docData = await doctorModel.findById(docId)
        let slots_booked = docData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({
            success: true,
            message: 'Appointment Cancelled'
        })


    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Appointment Payment using Razor Pay
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    ley_secret: process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorPay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentId || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: 'Appointment Cancelled or not found'
            })
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        const order = await razorpayInstance.orders.create(options)

        res.json({
            success: true,
            order
        })


    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === paid) {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({
                success: true,
                message: 'Payment Successful'
            })
        } else {
            res.json({
                success: false,
                message: 'Payment Unsuccessful'
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


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorPay, verifyRazorpay }