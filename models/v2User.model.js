import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    house_no : {type: String, required: true},
    appartment_name : {type: String},
    street : {type : String , required: true},
    landmark : {type: String},
    area : {type: String},
    city : {type: String},
    pincode : {type: Number},
    address_type : {type: String, required : true , default : "Home"}
},
{versionKey : false}
);

var v2UserSchema = mongoose.Schema({
    name : String,
    phone : {type : String, validate : /^[0-9]{10}/},
    email : String,
    photo : String,
    accessToken: String,
    addresses : [addressSchema],
},
{versionKey : false}    
);

var v2UserModel = mongoose.model('v2Users' , v2UserSchema);

export default v2UserModel;