const mongoose = require("mongoose");
const {Schema} = mongoose;

const OrderSchema = new Schema({
    
    status : {
        type : String,
        required : true,
        default : "placed"
    },
    date : {
        type : String,
        required : true
    },
    payment : {
        type : Boolean,
        required : true,
        default : false
    },
    quantity :{
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true,
        maxLength : 300
    }
})

module.exports = mongoose.model("order", OrderSchema);