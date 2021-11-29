import express from "express";

import {getAllItems,getAllCategories,getAllSubCategories,
    getAllItemsOfACategory, getAllItemsOfASubCategory,
    getAnItem,addAnItem,updateAnItem,deleteAnItem,
    addCategory,updateCategory,deleteCategory,
    addSubCategory,updateSubCategory,deleteSubCategory, addBestDealsItem, updateBestDeals, deleteBestDeals, getAllBestDealsItem
} from "../controllers/newItems.controller.js";

const router = express.Router();

//General Route
router.get("/items" , getAllItems);
router.get("/cat" , getAllCategories);
router.get("/subCat/:catid" , getAllSubCategories);
//General Route

//Item Routes
router.get("/items/:catid" , getAllItemsOfACategory);
router.get("/items/:catid/:subid" , getAllItemsOfASubCategory);
router.get("/:itemid" , getAnItem);
//Item Routes


//Admin Panel Routes
router.post("/item/add/:catid/:subid" , addAnItem);
router.patch("/item/update/:itemid" , updateAnItem);
router.delete("/item/delete/:itemid" , deleteAnItem);

router.post("/cat/add/" , addCategory);
router.patch("/cat/update/:catid" , updateCategory);
router.delete("/cat/delete/:catid" , deleteCategory);

router.post("/subCat/add/:catid" , addSubCategory);
router.patch("/subCat/update/:catid/:subid" , updateSubCategory);
router.delete("/subCat/delete/:catid/:subid" , deleteSubCategory);
//Admin Panel Routes

//best deals routes
router.get("/get/bestDeals", getAllBestDealsItem);
router.post("/bestDeals", addBestDealsItem);
router.patch("/bestDeals/update/:dealsId", updateBestDeals);
router.delete("/bestDeals/delete/:dealsId", deleteBestDeals);

export default router;
