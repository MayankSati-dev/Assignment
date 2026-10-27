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
        }
})


const LeadModel=mongoose.model("Lead",LeadSchema)

export default LeadModel