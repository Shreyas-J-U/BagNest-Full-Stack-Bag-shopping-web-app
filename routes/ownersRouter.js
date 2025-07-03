const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners_model");

// Test GET route to verify router is working
router.get("/", function (req, res) {
  res.send("Hey it's working");
});

// Owner creation route (enabled only in development mode)
if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    try {
      //  Check if any owner already exists
      let owners = await ownerModel.find();

      // Prevent creation if an owner already exists
      if (owners.length > 0) {
        return res
          .status(403) // Changed from 504 to 403: "Forbidden"
          .send("You don't have permission to create a new owner.");
      }

      //  Extract owner details from the request body
      let { name, email, password } = req.body;

      //  Create new owner in the database
      let createdOwner = await ownerModel.create({
        name,
        email,
        password,
      });

      // Respond with created owner and HTTP 201 (Created)
      res.status(201).send(createdOwner);
    } catch (error) {
      //  Handle unexpected errors
      console.error("Error creating owner:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}

router.get("/admin", function (req, res) {
  res.render("createproducts", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

module.exports = router;
