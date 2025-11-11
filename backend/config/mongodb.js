import mongoose from 'mongoose'

const connectDB = async () => {

    try {

        mongoose.connection.on('connected', () => console.log('Database Connected'));

        mongoose.connection.on('error', (err) => {
            console.log('MongoDB Connection error. please make sure mongoDB is running.' + err);
            process.exit();

        })
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto}`)

    } catch (error) {
        console.log("Error while connecting DB" + error)
    }



}

export default connectDB;