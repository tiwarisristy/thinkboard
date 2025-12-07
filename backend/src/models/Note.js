import mongoose from "mongoose";

//1 i am going to create schema
//2. i am going to build model based off of that schema
const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        required: true,
        type: String,
    },

},

{timestamps: true}// createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema)

export default Note;