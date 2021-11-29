import express from "express";

import {getAllUsers , getCurrentUser , editCurrentUser , deleteCurrentUser} from "../controllers/v2User.controller.js";
import {getAllAddress , addAddress, updateAddress , deleteAddress} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/" , getAllUsers);

router.get("/current" , getCurrentUser);

//Logout to be called from client side
//save token to cookies and then during logout clear the cookie
//with saved jwt 

router.patch("/current" , editCurrentUser);

router.delete("/current" , deleteCurrentUser);

router.get("/current/address" , getAllAddress);

router.patch("/current/address" , addAddress);
router.patch("/current/address/update/:addid" , updateAddress);
router.patch("/current/address/delete/:addid" , deleteAddress);

export default router;