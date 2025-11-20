import doctorModel from './../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            succes: false,
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
            succes: false,
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
            succes: false,
            message: error.message
        })
    }
}


export { changeAvailablity, doctorList, doctorLogin }