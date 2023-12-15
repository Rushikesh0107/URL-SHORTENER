import mongoose from 'mongoose'

export const ConnectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/url-shortener")
        .then(() => {
            console.log("Connected to MongoDB");
        })
    } catch (error) {
        throw new Error(error)
    }
}

