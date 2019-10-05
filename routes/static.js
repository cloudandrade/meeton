const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

//models
require("../models/User");
const User = mongoose.model("users");

//Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
