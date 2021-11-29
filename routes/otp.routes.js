import express from "express";

import {generateOTP , verifyOTP , getAllDetails, verifyFacebookGoogleLogin} from "../controllers/otp.controller.js";

const router = express.Router();

router.post('/generate' ,generateOTP);
router.post('/verify' , verifyOTP);     //as soon as otp is verified a bearer token is sent and a user profile is created
router.post('/social' , verifyFacebookGoogleLogin);

router.get('/' , getAllDetails);

export default router;