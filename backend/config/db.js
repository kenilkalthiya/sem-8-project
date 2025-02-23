import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb://localhost:27017/food-order-management').then(()=>console.log("DB Connected"));
   
}

// Kenil Cluster0: 'mongodb+srv://kenilkalathiya8320:4Dereg8Kl8GHuMmj@cluster0.huicd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'