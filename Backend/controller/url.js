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

export default generateShortUrl;