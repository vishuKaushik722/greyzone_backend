import otpModel from "../models/otp.model.js";
import v2User from "../models/v2User.model.js";
import https from "https";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from 'axios';

dotenv.config();

export const generateOTP = async(req,res,next) => {

    const number = req.body.number;
    number.toString();
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

    await otpModel.insertMany([{
        number : number,
        otp : otp
    }])  
    https.get(`https://2factor.in/API/V1/e8c91852-bf45-11ea-9fa5-0200cd936042/SMS/${number}/${otp}`);
    res.json('OTP sent');

}

export const verifyOTP = async(req,res,next) => {

    const number = req.body.number;
    const otp = req.body.otp;

    const data = await otpModel.find({$and : [{"number" : number},{"otp":otp}]});
    if(data.length)
    {
        const existingUser = await v2User.find({"phone" : number});
        if(existingUser.length === 0)
        {
            await v2User.insertMany([
                {
                    phone : number
                }   
            ])
        }
        const userID = await v2User.findOne({phone : number});
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({user : userID.toString()} , secretKey , {
            expiresIn : '2400h' 
        });

        await otpModel.deleteOne({"number" : number});
        res.status(200).send({token});
    }
    else
    {
        await otpModel.deleteOne({"number" : number});
        res.status(404).json('OTP Verification failed');
    }
}

export const verifyFacebookGoogleLogin = async (req, res) => {
    const { user, via } = req.body;
    console.log(via)
    if(via === "facebook") {
        const existingUser = await v2User.find({"accessToken" : user.userID});
        if(user && existingUser.length === 0) {
            await v2User.insertMany([
                {
                    name : user.name,
                    accessToken: user.userID,
                    photo: user.imageURL,
                    email: user.email
                }   
            ])
        }
            const userID = await v2User.findOne({accessToken : user.userID});
            console.log(userID)
            const secretKey = process.env.JWT_SECRET;
            const token = jwt.sign({user : userID.toString()} , secretKey , {
                expiresIn : '2400h'
            });
            res.status(200).send({token});
        
    } else if (via === "google") {
        const existingUser = await v2User.find({"accessToken" : user.id});
        if(existingUser.length === 0) {
            await v2User.insertMany([
                {
                    name : user.name,
                    accessToken: user.id,
                    photo: user.photo,
                    email: user.email
                }   
            ])
        }
        
        const userID = await v2User.findOne({accessToken : user.id});
        console.log(userID)
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({user : userID.toString()} , secretKey , {
            expiresIn : '2400h'
        });
        res.status(200).send({token});
    } else { 
        console.log("Please login from the app")
    }
}

export const getAllDetails = async(req,res) => {
    
    try{
        const data = await otpModel.find();
        res.status(200).send(data);
    }
    catch(err){
        res.status(404).send({message : err.message});
    }
}