import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    density:{
        type:String
    },
    viscosity: {
        type:String
    },
    temperature:  {
        type:String
    },
    dtn:  {
        type:String
    },
},{timestamps:true})
export default mongoose.model("insertdata", Data);


