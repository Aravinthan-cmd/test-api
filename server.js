import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sensorRoute from "./api/routes/sensor.js";
import bodyParser from "body-parser";

const app = express();

const connect = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/nanoprecise');
        console.log('Mongodb Connected..');
    } catch (error) {
        throw error;
    }
};
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});
mongoose.connection.on('disconnected',()=>{
    console.log('Mongodb disconnected...');
});

//middlewares
//for json
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.json());

app.use(cors({
    origin: '*',
}))

app.use('/sensor',sensorRoute);

app.listen(4000, ()=>{
    connect();
    console.log('Server Started..');
});