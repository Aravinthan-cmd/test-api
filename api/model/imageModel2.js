import mongoose from "mongoose";

const Image2 = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        alert: {
            type: Boolean,
        },
        image:{
            type: String,
        }
    },{timestamps:true}
)

export default mongoose.model('ImageData2', Image2);