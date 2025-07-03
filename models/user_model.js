const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/bag_nest");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    trim: true,
  },
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  isadmin: Boolean,
  orders: {
    type: Array,
    default: [],
  },
  contact: Number,
  picture: String,
});

module.exports = mongoose.model("user", userSchema);
