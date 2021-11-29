import express from "express";

const router = express.Router();

import {getAllPosters, getVisiblePosters, 
        addAPoster, changeVisibilityOfAPoster,
        deleteAPoster} from "../controllers/posters.controller.js";

router.get("/", getAllPosters);
router.get("/visible", getVisiblePosters);
router.post("/" , addAPoster);
router.patch("/:posterid", changeVisibilityOfAPoster);
router.delete("/:posterid" , deleteAPoster);

export default router;