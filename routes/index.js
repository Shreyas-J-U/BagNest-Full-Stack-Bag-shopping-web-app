const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const Product = require("../models/product_model");
const userModel = require("../models/user_model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, Loggedin: false });
});

router.get("/shop", isLoggedin, async function (req, res) {
  try {
    const products = await Product.find();
    // console.log(products);
    let success = req.flash("success");
    res.render("shop", { products, success });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/addtocart/:id", isLoggedin, async function (req, res) {
  try {
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/shop");
    }

    if (!user.cart) {
      user.cart = [];
    }

    user.cart.push(req.params.id); 
    await user.save();

    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.error("Error in /addtocart:", err);
    req.flash("error", "Failed to add product to cart");
    res.redirect("/shop");
  }
});

router.get("/cart", isLoggedin, async function (req, res) {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    res.render("cart", {
      products: user.cart,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    console.error("Error loading cart:", err);
    req.flash("error", "Could not load cart");
    res.redirect("/shop");
  }
});

router.get("/logout", isLoggedin, function (req, res) {
  res.render("shop");
});

module.exports = router;
