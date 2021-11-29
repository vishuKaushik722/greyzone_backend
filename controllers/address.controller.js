import mongoose from "mongoose";
import v2UserModel from "../models/v2User.model.js";
import JWTVerification from "../middleware/jwtAuth.middleware.js";

export const getAllAddress = async(req,res,next) => {

    const decodedID = JWTVerification(req,res);
    try{
        const addresses = await v2UserModel.find({"_id" : decodedID} , {addresses : 1});
        res.status(200).json(addresses);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const addAddress = async(req,res,next) => {

    const decodedID = JWTVerification(req,res);
    const address = req.body;

    if(!mongoose.Types.ObjectId.isValid(decodedID))
        return res.status(404).send('No User with this ID');

    v2UserModel.findOneAndUpdate(
        {_id : decodedID},
        {$push : {addresses : address}},

        function(error,result){
            if(error){
                res.status(404).json({message : `Error in deleting`});
            }
            else{
                res.status(200).json({message : `Added Successfully`});
            }
        }
    )
    
}

export const updateAddress = async(req,res,next) => {

    const decodedID = JWTVerification(req,res);

    const addressID = req.params.addid;

    const address = req.body;

    if(!mongoose.Types.ObjectId.isValid(decodedID))
        return res.status(404).json('No user with this ID');
    if(!mongoose.Types.ObjectId.isValid(addressID))
        return res.status(404).json('No address with this ID');

    await v2UserModel.findOneAndUpdate(
        {_id : decodedID , "addresses._id" : addressID},
        {$set : {"addresses.$" : address}},

        function(err){
            if(err){
                res.status(404).json({message : `Cannot update address`})
            }
            else
                res.status(200).json({message : `Updated Successfully`})
        }
    )
}

export const deleteAddress = async(req,res,next) => {

    const decodedID = JWTVerification(req,res);
    const addressID = req.params.addid;
    
    if(!mongoose.Types.ObjectId.isValid(decodedID))
        return res.status(404).json('No user with this ID');
    if(!mongoose.Types.ObjectId.isValid(addressID))
        return res.status(404).send('No address with this ID');

    
    await v2UserModel.findOneAndUpdate(
        {_id : decodedID} ,
        {$pull : {addresses : {_id : addressID}}},
        {new : true},
        function(err){
            if(err){
                res.status(404).json({message : `Error in deleting this address`});
            }
            else{
                res.status(201).json({message : `Address Deleted successfully`});
            }
        }
    )
}