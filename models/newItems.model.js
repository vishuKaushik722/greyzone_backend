import mongoose from "mongoose";

const newItemSchema = mongoose.Schema({
    category : {type : String, required : true},
    subCategory :  {type : String, required : true},
    itemName : {type: String, required: true},
    itemPrice : {type: Number, requried : true},
    itemImage : {type : String , required : true},
    prevPrice: {type : Number , required : true}
},
{versionKey : false});

var newItemModel = mongoose.model('NewItems' , newItemSchema);

export default newItemModel;
