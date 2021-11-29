import mongoose from "mongoose";

const posterSchema = mongoose.Schema({
    "img_url" : {type:String, required : true},
    "is_visible" : {type : String, default : "yes"},
    "title" : {type:String, required : true},
    "description" : {type:String, required : true},
},
{versionKey : false}
);

const posterModel = mongoose.model("Posters" , posterSchema);

export default posterModel;