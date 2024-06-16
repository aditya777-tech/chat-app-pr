import mongoose from 'mongoose';
 const connectToMongoDB = async (req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongo db is connected');

    }
    catch(error){
        console.log('it is not connected',error.message);

    }
}

export default connectToMongoDB;

