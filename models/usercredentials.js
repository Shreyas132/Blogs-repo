const mongoose = require("mongoose")

const credentialSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Usercred = mongoose.model("Usercred",credentialSchema)

module.exports = Usercred