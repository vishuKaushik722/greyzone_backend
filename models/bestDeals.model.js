import mongoose from "mongoose";

const bestDealsSchema = mongoose.Schema({
    itemName : {type: String, required: true},
    itemPrice : {type: Number, requried : true},
    itemImage : {type : String , required : true},
    prevPrice: {type : Number , required : true}
},
{versionKey : false});

var bestDealsModel = mongoose.model('BestDeals' , bestDealsSchema);

export default bestDealsModel;
