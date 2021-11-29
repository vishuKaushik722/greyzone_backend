import mongoose from "mongoose";

import posterModel from "../models/poster.model.js";

export const getAllPosters = async(req,res) => {
    try{
        const posters = await posterModel.find();
        res.status(200).json(posters);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const getVisiblePosters = async(req,res) => {
    try{
        const posters = await posterModel.find({"is_visible" : "yes"});
        res.status(201).json(posters);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const addAPoster = async(req,res) => {
    const poster = req.body;
    const newPoster = new posterModel(poster);
    try{
        await newPoster.save();
        res.status(200).json(newPoster);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }   
}

export const changeVisibilityOfAPoster = async(req,res) => {
    const posterID = req.params.posterid;
    const poster = req.body;

    if(!mongoose.Types.ObjectId.isValid(posterID))
        return res.status(404).json(`Poster with this ID does not exist`);
    
    const updatedPoster = await posterModel.findByIdAndUpdate(
        posterID ,{...poster,posterID} , {new: true});
    
    res.status(201).json(updatedPoster);
}

export const deleteAPoster = async(req,res) => {
    const posterID = req.params.posterid;

    if(!mongoose.Types.ObjectId.isValid(posterID))
        return res.status(404).json(`Poster with this ID does not exist`);

    await posterModel.findByIdAndDelete(posterID);

    res.status(200).json(`Poster successfully deleted from database`);
}