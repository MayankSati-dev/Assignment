import mongoose from "mongoose"

export function connecttoDb(){
    mongoose.connect("mongodb+srv://themayanksati_db_user:dIrmZGTNqECyKEIJ@cluster0.xvyjccg.mongodb.net/Assignment")
    console.log("db is connected")
}
