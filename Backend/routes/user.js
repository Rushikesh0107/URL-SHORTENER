import express from 'express';
import { handleUserSignUp, handleLogin, handleLogout, handleRefreshToken }  from "../controller/user.js"
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/signup').post(handleUserSignUp)

router.route('/login').post(handleLogin);

router.route('/logout').post(verifyJwt, handleLogout);

router.route('/refresh-token').get(handleRefreshToken)

export default router;

