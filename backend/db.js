const mongoose = require("mongoose");

// const mongoURI = "mongodb://localhost:27017/test";

// const connectToMongo = async () => {
//   try {
//     await mongoose.connect(mongoURI, () => {
//       console.log("Connected to Mongo Successfully");
//     });
//   } catch (err) {
//     console.log("Filed to Connect to Mongodb", err);
//   }
// };

// module.exports = connectToMongo;
mongoose.set("strictQuery", false);
const server = "127.0.0.1:27017";
const database = "iNotebook";
const connectToMongo = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`);
    console.log("Connected to Mongo Successfully");
  } catch (err) {
    console.log("Filed to Connect to Mongodb", err);
  }
};

module.exports = connectToMongo;
