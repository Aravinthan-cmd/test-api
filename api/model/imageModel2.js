import mongoose from "mongoose";
const {Schema} = mongoose;

const Image = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        alert: {
            type: Boolean,
            required: true,
        },
        image:{
            data: Buffer,
            contentType: String,
        }
    },{timestamps:true}
)

export default mongoose.model('ImageData2', Image);