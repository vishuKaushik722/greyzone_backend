import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    number : {type : String, validate : /^[0-9]{10}/},
    otp : {type: String, validate : /^[0-9]{6}/}
},
{versionKey : false});

var otpModel = mongoose.model('OTP-Verify' , otpSchema);

export default otpModel;

