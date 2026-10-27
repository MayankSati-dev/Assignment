import mongoose from "mongoose";


const LeadSchema=new mongoose.Schema({
        name:{
            type:String
        },
        email:{
            type:String
        },
        number:{
            type:String
        },
        status:{
            type:Boolean,
            default:true
            
        }
})


const LeadModel=mongoose.model("Lead",LeadSchema)

export default LeadModel