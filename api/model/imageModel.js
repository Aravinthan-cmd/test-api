import mongoose from "mongoose";

const Image = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        temperature:{
            type: String
        },
        image:{
            type: String
        }
    },{timestamps:true}
)
export default mongoose.model('ImageData', Image);