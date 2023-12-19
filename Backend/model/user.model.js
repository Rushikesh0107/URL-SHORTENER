import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim:true
    } ,
    refreshToken: {
        type: String,
        trim: true
    },
}, {timeStamps: true})

userSchema.methods.generateAccessToken =  function() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

export const User = mongoose.model('User', userSchema);

