import mongoose from "mongoose";

const subCatSchema = mongoose.Schema({
    category : {type: String, required: true},
    name : {type : String, required: true},
    image : {type:String, required: true},
},
{versionKey : false}
);

var subCategoryModel = mongoose.model("Subcategories", subCatSchema);

export default subCategoryModel;