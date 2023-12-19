import { User } from '../model/user.model.js';
import jwt from 'jsonwebtoken';

export const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken}
    } catch (error) {
        throw new Error(error.message);
    }
}

export const handleLogin = async (req, res) => {
    console.log("hello");
    const { email, password} = req.body;
    const user = await User.findOne({email, password});

    if(!user) {
        return res.status(400).json({msg: "Invalid Credentials"})
    }

    const dbPassword = user.password;

    if(dbPassword !== password) {
        return res.status(400).json({msg: "Invalid Credentials"})
    }

    const id = user._id;

    const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id);

    await User.findByIdAndUpdate(
        id, 
        {
            $set: {
                refreshToken: refreshToken
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({msg: "Logged In"})
}

export const handleUserSignUp =  async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({msg: "Please enter all fields"})
    }

    const existedUser = await User.findOne({})

    //console.log(req.files);

    if(existedUser) {
       return res.status(400).json({msg: "User already exists"})
    }

    try{
        await User.create({name, email, password})
        res.status(201).json({msg: "User created successfully"})
    } catch(error){
        res.status(400).json({error: error.message})
    }
} 

export const  handleLogout = async (req, res) => {
    await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: ""
                }
            },
            { new: true },
        
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({msg: "Logged Out"})
}

export const handleRefreshToken = async (req, res) => {
    const incommmingRefreshToken = req.headers.cookie.split(";")[1].replace(" refreshToken=", "");
    
    if(!incommmingRefreshToken) {
        return res.status(401).json({msg: "Token not found"})
    }

    try {
        const decoded = jwt.verify(incommmingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);

        if(!user) {
            return res.status(401).json({msg: "Unauthorized"})     
        }   

        console.log(user.refreshToken, "hello");

        if(user.refreshToken !== incommmingRefreshToken) {
            return res.status(401).json({msg: "Token is used or expired"})
        }

        const {accessToken, newRefreshToken} = await generateAccessRefreshToken(user._id);

        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: newRefreshToken
                }
            },
            { new: true },
        )

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({msg: "Token refreshed"})


    } catch (error) {
        throw new Error(error.message);
    }
    
}

