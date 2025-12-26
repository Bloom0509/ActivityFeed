const express = require("express");
const mongoose = require("mongoose");
const activityRoutes = require("./routes/activityRoute");
const cors=require("cors")

const app = express();

app.use(express.json());
app.use(cors())

mongoose.connect("mongodb://localhost:27017/activity-feed").then(() => console.log("MongoDB connected"));

app.use(activityRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
