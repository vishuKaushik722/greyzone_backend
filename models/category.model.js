import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name : {type : String, required : true},
    image : {type: String}
},
{versionKey : false}
);

var categoryModel = mongoose.model("Categories" , categorySchema);

export default categoryModel;