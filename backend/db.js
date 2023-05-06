const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoURI = "mongodb://localhost:27017";

const connectTOMongo = async () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongodb successfully");
  });
};

module.exports = connectTOMongo;
