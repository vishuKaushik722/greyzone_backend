import mongoose from "mongoose";

import newItemModel from "../models/newItems.model.js";
import categoryModel from "../models/category.model.js";
import subCategoryModel from "../models/subCategory.model.js";
import bestDealsModel from "../models/bestDeals.model.js";


export const getAllCategories = async(req,res) => {
    try{
        const categories = await categoryModel.find();
        res.status(200).json(categories);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const getAllSubCategories = async(req,res) => {
    const categoryName = req.params.catid;
    try{
        const subCategories = await subCategoryModel.find({"category" : categoryName});
        res.status(200).json(subCategories);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}
export const getAllItems = async(req,res) => {
    try{
        const items = await newItemModel.find();
        res.status(200).json(items);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const getAllItemsOfACategory = async(req,res) => {
    const categoryName = req.params.catid;
    await newItemModel.find({"category" : categoryName} ,
        function(err,result){
            if(err)
                res.status(404).json(`Category Not Found`);
            else
                res.status(200).json(result);
        }
    )
}

export const getAllItemsOfASubCategory = async(req,res) => {
    const categoryName = req.params.catid;
    const subCategoryName = req.params.subid;
    await newItemModel.find({"category" : categoryName , "subCategory" : subCategoryName},
        {"category" : 0 , "subCategory" : 0},
        function(err,result){
            if(err)
                res.status(404).json(`Category or SubCategory Not Found`);
            else
                res.status(200).json(result);
        }
    )
}

export const getAnItem = async(req,res) => {
    const itemID = req.params.itemid;

    if(!mongoose.Types.ObjectId.isValid(itemID))
        return res.status(404).json(`No Item with this ID`);
    
    try{
        const item = await newItemModel.findById(itemID);
        res.status(200).json(item);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }

}

export const addAnItem = async(req,res) => {
    const item = req.body;
    const categoryName = req.params.catid;
    const subCategoryName = req.params.subid;

    const newItem = new newItemModel({"category" : categoryName , 
                                    "subCategory" : subCategoryName,
                                    "itemName" : item.itemName,
                                    "itemPrice" : item.itemPrice,
                                    "itemImage" : item.itemImage,
                                    "prevPrice": item.prevPrice
                                });

    try{
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const updateAnItem = async(req,res) => {
    const itemID = req.params.itemid;
    const item = req.body;

    if(!mongoose.Types.ObjectId.isValid(itemID))
        return res.status(404).json(`Not a Valid Item ID`);
    
    const updatedItem = await newItemModel.findByIdAndUpdate(itemID,{...item,itemID},{new : true});
    res.status(201).json(updatedItem);
}

export const deleteAnItem = async(req,res) => {
    const itemID = req.params.itemid;

    if(!mongoose.Types.ObjectId.isValid(itemID))
        return res.status(404).json(`Not a Valid Item ID`);

    await newItemModel.findByIdAndDelete(itemID);
    res.status(200).json(`Item deleted successfully`);
}

export const addCategory = async(req,res) => {

    const category = req.body;
    const newCategory = new categoryModel(category);
    try{
        await newCategory.save();
        res.status(201).json(newCategory);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const updateCategory = async(req,res) => {

    const category = req.body;
    const categoryName = req.params.catid;
    try{
        const updatedCategory = await categoryModel.findOneAndUpdate({"name" : categoryName},category,{new : true});
        res.status(201).json(updatedCategory);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const deleteCategory = async(req,res) => {

    const categoryName = req.params.catid;
    try{
        await categoryModel.findOneAndDelete({"name" : categoryName});
        await subCategoryModel.findOneAndDelete({"name" : categoryName});
        await newItemModel.deleteMany({"category" : categoryName});
        res.status(200).json({message : "Category and it's corresponding items have been deleted"});
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const addSubCategory = async(req,res) => {

    const categoryName = req.params.catid;
    const subCategory = req.body;
    
    const categoryFound = await categoryModel.find({"name" : categoryName});
    
    if(!categoryFound.length)
        return res.status(404).json({message : "This category does not exist. Add it using add category route"})

    const newSubCategory = new subCategoryModel({"category" : categoryName,
                                                "name" : subCategory.name,
                                                "image" : subCategory.image});
    
    try{
        await newSubCategory.save();
        res.status(200).json(newSubCategory);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const updateSubCategory = async(req,res) => {

    const categoryName = req.params.catid;
    const subCategoryName = req.params.subid;

    const subCategory = req.body;

    try{
        const updatedSubCategory = await subCategoryModel.findOneAndUpdate({"category" : categoryName , "name" : subCategoryName}, subCategory ,{new : true});
        res.status(201).json(updatedSubCategory);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }

}

export const deleteSubCategory = async(req,res) => {

    const categoryName = req.params.catid;
    const subCategoryName = req.params.subid;

    try{
        await subCategoryModel.deleteMany({"category" : categoryName,"name" : subCategoryName});
        await newItemModel.deleteMany({"category" : categoryName,"name" : subCategoryName});
        res.status(201).json({message : "SubCategory and it's corresponding items have been deleted"});
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const addBestDealsItem = async (req, res) => {
    const item = req.body;
    
    const addedItem = new bestDealsModel(item);
    try{
        await addedItem.save();
        res.status(201).json(addedItem);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}

export const updateBestDeals = async (req, res) => {
    const itemID = req.params.dealsId;
    const item = req.body;

    if(!mongoose.Types.ObjectId.isValid(itemID))
        return res.status(404).json(`Not a Valid Item ID`);
    
    const updatedItem = await bestDealsModel.findByIdAndUpdate(itemID,{...item,itemID},{new : true});
    res.status(201).json(updatedItem);
}

export const deleteBestDeals = async(req,res) => {
    const itemID = req.params.dealsId;

    if(!mongoose.Types.ObjectId.isValid(itemID))
        return res.status(404).json(`Not a Valid Item ID`);

    await bestDealsModel.findByIdAndDelete(itemID);
    res.status(200).json(`Item deleted successfully`);
}

export const getAllBestDealsItem = async(req,res) => {
    try{
        const items = await bestDealsModel.find();
        res.status(200).json(items);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}