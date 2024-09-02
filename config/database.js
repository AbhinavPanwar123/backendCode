const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Assignment_Backend")
  .then(() => {
    console.log("MongoDb Connected");
  })
  .catch((err) => {
    console.log("MongoDb Connection Error", err);
  });
