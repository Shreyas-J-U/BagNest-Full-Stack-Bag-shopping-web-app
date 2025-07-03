const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      req.flash("error", "All fields are required.");
      return res.redirect("/");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists.");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    //  Automatically log in and redirect to /shop
    req.flash("success", "Registered and logged in successfully.");
    res.redirect("/shop");
  } catch (error) {
    console.error("Error in /register:", error.message);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect("/");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash('error', 'Email or password is incorrect.');
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Email or password is incorrect.');
      return res.redirect("/");
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("/shop");

  } catch (error) {
    console.error("Error in /login:", error.message);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect("/");
  }
};



module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};
