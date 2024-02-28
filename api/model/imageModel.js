import mongoose from "mongoose";
const {Schema} = mongoose;

const Image = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        temperature: {
            type: String,
        },
        image:{
            data: Buffer,
            contentType: String,
        }
    },{timestamps:true}
)

export default mongoose.model('ImageData', Image);