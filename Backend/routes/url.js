import express from 'express'
import generateShortUrl from '../controller/url.js'

const router = express.Router()

router.post('/', generateShortUrl)

export default router