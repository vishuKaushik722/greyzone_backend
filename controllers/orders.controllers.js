import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";

import orderModel from "../models/orders.model.js";
import v2UserModel from "../models/v2User.model.js";
import newItemModel from "../models/newItems.model.js";

import JWTVerification from "../middleware/jwtAuth.middleware.js";

export const getAllOrders = async(req,res,next) => {
    try{
        const orders = await orderModel.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }

}

export const getOrdersOfUser = async(req,res,next) => {

    const userID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});

    try{
        const userOrders = await orderModel.find({user : userID}).populate('user');
        res.status(200).json(userOrders);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }    
}  

export const getOneOrderOfUser = async(req,res,next) => {

    const userID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});

    const orderID = req.params.orderid;

    try{
        const order = await orderModel.findOne({_id : orderID}).populate('user');
        res.status(200).json(order);
    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}  

export const createAnOrder = async(req,res,next) => {

    const userID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});

    var order = {"user" : userID ,"order_status" : req.body.order_status};
    
    const newOrder = new orderModel(order);
    await newOrder.save();
    res.status(200).json(newOrder);
}  

export const addAnItemToCurrentOrder = async(req,res,next) => {
    
    const qty = req.body.item_quantity;
    const orderID = req.params.orderid;
    
    const oneItem = await newItemModel.findById({_id : req.body.item_id},{} ,
        function(err){
            if(err)
                res.status(404).json({message: `Item Does not Exist in Database`});
        })
    
    if(!mongoose.Types.ObjectId.isValid(orderID))
        return res.status(404).json({message : `Order with this ID does not exist`});
    
    const price = qty * oneItem.itemPrice;
    
    const item = {item_id : req.body.item_id , item_quantity : qty , item_name : oneItem.itemName,
                item_total_price : price};

    orderModel.findByIdAndUpdate(
        {_id : orderID},
        {$push : {items : item}},
        function(err){
            if(err)
                res.status(404).json({message : `Error in Addition`});
            else
                res.status(200).json({message : `Added Successfully`});
        }
    )
}

export const editAnItemInOrder = async(req,res,next) => {
    
    const item = req.body;
    const orderID = req.params.orderid;
    const itemInOrderID = req.params.itemid;

    if(!mongoose.Types.ObjectId.isValid(orderID))
        return res.status(404).json('No order with this ID');
    if(!mongoose.Types.ObjectId.isValid(itemInOrderID))
        return res.status(404).json('No item in order with this ID');

    
    await orderModel.findByIdAndUpdate(
        {_id: orderID , "items._id" : itemInOrderID},
        {$set : {"items.$" : item}},
        {new : true},

        function(err){
            if(err)
                res.status(404).json({message : `Cannot be Edited`});
            else
                res.status(200).json({message : `Edited Successfully`});
        }
    )
    
}  

export const deleteAnItemInOrder = async(req,res,next) => {

    const orderID = req.params.orderid;
    const itemInOrderID = req.params.itemid;

    
    await orderModel.findOneAndUpdate(
        {_id: orderID , "items._id" : itemInOrderID},
        {$pull : {items : {_id : itemInOrderID}}},
        {new : true},

        function(err){
            if(err)
                res.status(404).json({message : `Cannot be Edited`});
            else
                res.status(200).json({message : `Edited Successfully`});
        }
    )
    
} 

export const addAddress = async(req,res) => {
    
    const userID = JWTVerification(req,res);

    const addressID = req.body.id;

    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});
    if(!mongoose.Types.ObjectId.isValid(addressID))
        return res.status(404).json({message : `Not a Valid Address ID`});

    const orderID = req.params.orderid;

    const address = await v2UserModel.findOne({_id : userID}, {addresses : {$elemMatch : {"_id" : addressID}}});

    const finalAddress = address.addresses[0];

    const Order = await orderModel.findOneAndUpdate({_id : orderID},{"order_address" : finalAddress});
    
    res.json(Order);
}


export const orderTotal = async(req,res,next) => {

    const finalOrder = req.body;
    const orderID = req.params.orderid;

    if(!mongoose.Types.ObjectId.isValid(orderID))
        return res.status(404).json({message : `Order ID does not exist`});

    const updatedOrder = await orderModel.findByIdAndUpdate({_id : orderID} , {"order_total" : finalOrder.order_total , "order_status" : "Confirmed"});

    res.json(updatedOrder);
}


export const payForOrder = async(req,res,next) => {

    const orderID = req.params.orderid;
    const Order = await orderModel.findById(orderID);
    const amount = Order.order_total;
    var instance = new Razorpay({
        key_id : process.env.RZP_ID,
        key_secret : process.env.RZP_SECRET
    });

    var currTime = new Date();
    currTime = currTime.toString();

    var options = {
        amount : amount,
        currency : "INR",
        receipt : "Order_Receipt"
    };

    instance.orders.create(options,function(err,order) {
        console.log(order.id);
        res.json({orderId : order.id});
    })
}

export const payForOrder2 = async(req,res,next) => {
    
    let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto.createHmac('sha256', 'Wok5mJv2F0pa5HKLeXZfUr9r')
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig received " ,req.body.response.razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
    var response = {"signatureIsValid":"false"}
    if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
    res.send(response);
}

export const cancelOrder = async(req,res,next) => {

    const userID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});

    const orderID = req.params.orderid;


    await orderModel.findOneAndUpdate({_id : orderID} , {
        order_status : "Cancelled"
    },
    function(err){
        if(err)
            res.json({message : `Cannot cancel this order`});
        else
            res.json({message : `Order Cancelled Successfully`});
    })
}

export const deleteAnOrder = async(req,res,next) => {

    const userID = JWTVerification(req,res);
    if(!mongoose.Types.ObjectId.isValid(userID))
        return res.status(404).json({message : `Not a Valid User ID`});

    const orderID = req.params.orderid;

    await orderModel.findByIdAndDelete(orderID);

    res.status(200).json({message : `Order Deleted Successfully`});
}  