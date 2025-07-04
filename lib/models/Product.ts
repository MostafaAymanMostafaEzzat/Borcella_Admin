import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    media: [String],
    category: String,
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    tags: [String],
    sizes: [String],
    colors: [String],
    price:{type : mongoose.Schema.Types.Decimal128, get : (v :mongoose.Schema.Types.Decimal128) => parseFloat(v.toString())},
    expense: { type: mongoose.Schema.Types.Decimal128, get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }},

} , {timestamps :true , toJSON : {getters : true}})


const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;