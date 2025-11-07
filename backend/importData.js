// importData.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Domain = require("./models/Domain");

// connect using MongoDB URL from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const data = JSON.parse(fs.readFileSync("questions.json", "utf-8"));

async function importData() {
  try {
    await Domain.deleteMany(); // clear existing data
    await Domain.insertMany(data);
    console.log("Data imported successfully!");
  } catch (err) {
    console.error("Error importing data:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
