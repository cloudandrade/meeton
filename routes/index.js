const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const userRoutes = require("./users");
const staticRoutes = require("./static");
const jovensRoutes = require("./jovens");
const companhiaRoutes = require("./companhias");
const consultorRoutes = require("./consultor");
const mongoose = require("mongoose");

//models
require("../models/Companhia");
const Companhia = mongoose.model("companhias");
require("../models/Jovem");
const Jovem = mongoose.model("jovens");
require("../models/Consultor");
const Consultor = mongoose.model("consultores");
require("../models/User");
const Users = mongoose.model("users");

//Routes
router.get("/", (req, res) => res.render("index"));
router.use("/users", userRoutes);
router.use("/auth", staticRoutes);
router.use("/dashboard/jovens", jovensRoutes);
router.use("/dashboard/companhias", companhiaRoutes);
router.use("/dashboard/consultores", consultorRoutes);

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const companhiaCount = await Companhia.countDocuments({});
  const jovemCount = await Jovem.countDocuments({});
  const consultorCount = await Consultor.countDocuments({});
  const usersCount = await Users.countDocuments({});

  res.render("home", {
    name: req.user.name,
    userscont: usersCount,
    companhiacont: companhiaCount,
    jovemcont: jovemCount,
    consultorcont: consultorCount
  });
});

module.exports = router;
