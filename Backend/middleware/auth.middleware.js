import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

export const verifyJwt = async (req, res, next) => {
    try {
        //const token = req.cookie?.accessToken || req.headers("Authorization").replace("Bearer ", "")
        const token = req.headers.cookie.split("=")[1].replace("; refreshToken", "");
        console.log(token);
        
        if(!token) {
            return res.status(401).json({msg: "Token Not Found"})
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password");

        if(!user) {
            return res.status(401).json({msg: "Unauthorized"})
        }

        req.user = user;
        next();

    } catch (error) {
        throw new Error(error.message);
    }
}