const express = require("express");
const mongoose = require("mongoose");
const activityRoutes = require("./routes/activityRoute");
const cors=require("cors")
const http=require("http")
const {Server}=require("socket.io")

const app = express();
const server=http.createServer(app);
app.use(express.json());
app.use(cors())



const io=new Server(server,{
  cors:{
    origin:["http://localhost:3001","http://127.0.0.1:3001"],
    methods:["GET","POST"]
  }
});

//websocket connection
io.on("connection",socket=>{
  console.log('Client connected!!',socket.id)

  socket.on("disconnect",()=>{
    console.log("Client disconnected!!!")
  });
});



mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(activityRoutes);
app.use((req,res,next)=>{req.io=io;next();})

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
