const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development: mongoose");

mongoose
  .connect(`${config.get("MONGODB_URI")}/bag_nest`)
  .then(function () {
    dbgr("connected");
  })
  .catch(function (error) {
    console.error("Connection error:", error);
  });

module.exports = mongoose.connection;
