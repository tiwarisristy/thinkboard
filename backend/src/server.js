import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import path from "path";

dotenv.config();

const app = express();
const PORT= process.env.PORT || 5001;
const __dirname = path.resolve();


//middleware
if(process.env.NODE_ENV !== "production"){
  app.use(cors({
  origin: "http://localhost:5173",
}
));
}

app.use(express.json());//this middleware parse the JSON bodies: req.body
app.use(rateLimiter);


//our simple custom middleware
//app.use((req,res, next)=> {
   // console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
   // next();
//});
app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname, "../frontend","dist", "index.html"));
});
}



//what is endpoint? -> an endpoint is a combination of a url+ http method 
// that lets the cient interact with a specific resource
connectDB().then(()=>{
app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
  });
});



//start at 3:04:57