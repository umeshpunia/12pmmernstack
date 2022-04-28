const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const { DB_PASS, DB_USER, PORT } = process.env;
const port = PORT || 8000;

// connection
mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ubiz5.mongodb.net/mernstack?retryWrites=true&w=majority`,
  (err) => {
    if (err) return console.log("error", err);
    console.log("db is connected");
  }
);


// middlewares
app.use(express.json());



// routes
app.use('/api/',require('./routes/user.routes'))




// server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
