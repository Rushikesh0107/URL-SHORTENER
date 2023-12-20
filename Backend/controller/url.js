import { nanoid } from "nanoid";
import {URL} from "../model/url.model.js";

async function generateShortUrl(req, res) {
    
    if(!req.body.url){
        return res.status(400).json({
            error: "URL is required"
        })
    }
    const shortID = nanoid(8);

    await URL.create({
        shortID: shortID,
        redirectUrl: req.body.url,
        visitedHistory: []
    })

    res.status(201).json({
        shortID: shortID
    })
}

export const deleteUrl = async (req, res) => {
    const id = req.params.id
    const exx = await URL.findOneAndDelete({_id: id})
    res.status(200).json({
        message: "Deleted"
    })
}


export default generateShortUrl