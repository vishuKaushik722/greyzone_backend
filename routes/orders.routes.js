import express from "express";

import {getAllOrders , getOrdersOfUser , getOneOrderOfUser,
        addAnItemToCurrentOrder,
        createAnOrder, editAnItemInOrder, deleteAnItemInOrder,
        addAddress, 
        orderTotal, payForOrder, payForOrder2,
        cancelOrder , deleteAnOrder} from "../controllers/orders.controllers.js";

const router = express.Router();

router.get("/" , getAllOrders);

router.get("/current" , getOrdersOfUser);
router.get("/current/:orderid" , getOneOrderOfUser);    //use this route before payment

router.post("/current" , createAnOrder);        //get currentuserID 
                
router.patch("/current/add/:orderid" , addAnItemToCurrentOrder);
router.patch("/current/update/:orderid/:itemid" , editAnItemInOrder);
router.patch("/current/delete/:orderid/:itemid" , deleteAnItemInOrder);

router.patch("/current/address/:orderid" , addAddress);

router.patch("/current/:orderid/sum" , orderTotal);

router.post("/current/:orderid/payment" , payForOrder);
router.post("/current/:orderid/payment/confirm" , payForOrder2);

router.patch("/current/cancel/:orderid" , cancelOrder);
router.delete("/current/:orderid" , deleteAnOrder);

export default router;