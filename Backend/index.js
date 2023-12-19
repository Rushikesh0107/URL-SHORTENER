import express from 'express';
import urlRouter from './routes/url.js';
import { ConnectDB } from './db/connection.js';
import { URL } from './model/url.model.js';
import cors from 'cors';
import userRouter from './routes/user.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const app = express()
//access to to all origin
let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())
const port = 3000
ConnectDB();

app.use('/url', urlRouter)

app.use('/users', userRouter)

app.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    
    if (!shortID) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    try {
        const entry = await URL.findOneAndUpdate(
            { shortID },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            { new: true }
        );

        if (!entry) {
            console.log("Entry not found for shortId:", shortID);
            return res.status(404).json({
                error: "URL not found"
            });
        }

        res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error("Error during findOneAndUpdate:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.get('/analytics/:shortID', async (req, res) => {
    let shortID = req.params.shortID;
    try{
        let user = await URL.findOne({
            shortID
        })
        if(!user) {
            return res 
            .status(400)
            .json({msg: "User not found"})
        }
        res.json({clicks: user.visitHistory.length, analystics : user.visitHistory})
    } catch(error){
        console.log(error.message);
    }
})


app.get('/', async (req, res) => {
    try{
        const data = await URL.find({})
        res.status(200).json(data)
    }
    catch(error){
        console.log(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})