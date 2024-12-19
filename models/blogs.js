const mongoose = require("mongoose")

const BlogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    } ,
    snippet : {
        type:String,
        required:true
    },
    bbody : {
        type:String,
        required:true
    }
})

const Blogs = mongoose.model("Blogs",BlogsSchema)

module.exports = Blogs