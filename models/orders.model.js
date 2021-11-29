import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    item_id : {type : mongoose.Schema.Types.ObjectId},
    item_quantity : {type : Number ,  default : 1},
    item_name : {type :String},
    item_total_price : {type : Number}
})

const orderSchema = mongoose.Schema({

    user : {type : mongoose.Schema.Types.ObjectId ,
            ref : 'v2Users'},
    items : [itemSchema],
    order_total : {type : Number , default : 0},
    order_address : {
            house_no : {type: String},
            appartment_name : {type: String},
            street : {type : String},
            landmark : {type: String},
            area : {type: String},
            city : {type: String},
            pincode : {type: Number},
            address_type : {type: String}
    },
    order_status : {type : String , default : "NAN"}

},
{timestamps : true},
{versionKey : false});

const orderModel = mongoose.model("Orders" , orderSchema);

export default orderModel;