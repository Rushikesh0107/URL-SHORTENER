import express from 'express'
import generateShortUrl from '../controller/url.js'
import {deleteUrl} from '../controller/url.js'

const router = express.Router()

router.post('/', generateShortUrl)

router.delete('/:id', deleteUrl)

export default router