import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import connectToMongoDB from './connectiontoMongo/ConnectToMongoDb.js';
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(express.json()); // it is used to parse the json request for postman or from frontend:

const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('<h1>its working</h1>');

})

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes)

app.listen(port,()=>{
    connectToMongoDB();

    console.log("server is listening at",port);
})

