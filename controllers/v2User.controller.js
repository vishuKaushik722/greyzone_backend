import mongoose from "mongoose";

import v2UserModel from "../models/v2User.model.js";
import HttpException from "../utils/HttpException.utils.js";
import JWTVerification from "../middleware/jwtAuth.middleware.js"


export const getAllUsers = async(req,res) => {
    try{
        const users = await v2UserModel.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const getCurrentUser = async(req,res) => {
    try{
        const decodedID = JWTVerification(req,res);

        const userFound = await v2UserModel.findOne({_id : decodedID});

        if(!userFound){
            throw new HttpException(401, 'Authentication failed!');
        }
        res.status(200).json(userFound);
    }
    catch(err){
        res.status(401).json({message : err.message});
    }
}

export const editCurrentUser = async(req,res) => {

    const decodedID = JWTVerification(req,res);

    const user = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(decodedID))
        return res.status(404).json({message : 'No User with this ID'});

    const updatedUser = await v2UserModel.findByIdAndUpdate(decodedID,
        {...user,decodedID}, 
        {new : true});

    res.json(updatedUser);

}

export const deleteCurrentUser = async(req,res) => {

    const decodedID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(decodedID))
        return res.status(404).json({message : 'No user with this ID'});

    await v2UserModel.findByIdAndDelete(decodedID);

    res.json({message : 'User Deleted Successfully'});
   
}