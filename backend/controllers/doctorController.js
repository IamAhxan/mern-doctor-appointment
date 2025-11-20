import doctorModel from './../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({
            success: true,
            message: 'Availablity Changed'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({
            success: true,
            doctors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}



const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: 'Doctor Not Found'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            return res.json({
                success: true,
                message: 'Login Successful',
                token
            })
        } else {
            return res.json({
                success: false,
                message: 'Invalid Credentials'
            })
        }



    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}



const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId })
        res.json({
            success: true,
            appointments
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}



const appointmentCompleted = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })

            return res.json({
                success: true,
                message: "Appointment Completed"
            })
        } else {
            return res.json({
                success: false,
                message: 'Mark Completed Failed'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            succes: false,
            message: error.message
        })
    }
}




const appointmentCancelled = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

            return res.json({
                success: true,
                message: "Appointment Cancelled"
            })
        } else {
            return res.json({
                success: false,
                message: 'Cancelation Failed'
            })
        }



    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}



export { changeAvailablity, doctorList, doctorLogin, appointmentsDoctor, appointmentCompleted, appointmentCancelled }