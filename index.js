const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://root:admin@mongo:27017?authSource=admin")
  .then(() => console.log("Successfully connected to database "))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("<h2>Hi there!! !@@</h2>");
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listing on port :${port}`));
