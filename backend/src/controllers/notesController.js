import Note  from "../models/Note.js";
import mongoose from "mongoose";
//get request
export async function getAllNotes(_, res){
    try{
        const notes = await Note.find().sort({createdAt:-1});//newest first -1 will sort in desc. order
        res.status(200).json(notes)

    }catch (error){
        console.error("Error in getAllNotes controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}


//get note by id 
export async function getNoteById(req,res){
    try {
        const rawId = req.params.id;
        const id = typeof rawId === 'string' ? rawId.trim() : rawId;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid note id' });
        }

        const note = await Note.findById(id);
        if(!note) return res.status(404).json({message:"note not found"})
        res.json(note);
    } catch (error) {
        console.error("Error in getNoteById controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
};

//post request
export async function createNote(req, res) {
    try {
        const{title, content}= req.body
        const note = new Note({title, content})

       const savedNote = await note.save()
        res.status(201).json(savedNote);
    }catch (error) {
         console.error("Error in createNotes controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}



//put request
export async function updateNote(req, res) {
    try {
        const {title, content} = req.body
        const rawId = req.params.id;
        const id = typeof rawId === 'string' ? rawId.trim() : rawId;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid note id' });
        }

        const updatedNote = await Note.findByIdAndUpdate(id,
            {title,content},{
            new: true,
        });

        if(!updatedNote) return res.status(404).json({message:"Note not found"});

        res.status(200).json(updatedNote);
    } catch (error) {
      console.error("Error in updateNote controller:", error);
        res.status(500).json({message:"Internal server error"});   
    }
}


//delete request
export async function deleteNote(req, res)  {
   try {
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId.trim() : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid note id' });
    }

    const deleteNote = await Note.findByIdAndDelete(id);

    if(!deleteNote) return res.status(404).json({message:"Note not deleted"});

        res.status(200).json({message: "Note successfully deleted"});
   } catch (error) {
    console.error("Error in updateNote controller:", error);
        res.status(500).json({message:"Internal server error"}); 
   }
}
