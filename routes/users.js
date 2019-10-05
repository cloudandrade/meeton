const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

//models
require("../models/User");
const User = mongoose.model("users");

//Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

//register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Porfavor preencha todos os campos" });
  }

  //check if passwords match
  if (password !== password2) {
    errors.push({ msg: "Senhas não conferem" });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "Senha precisa ter ao menos 6 caracteres" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation passed
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          //user exists
          errors.push({ msg: "Email já cadastrado" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          //hash password
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(userCreated => {
                  req.flash("success_msg", "Conta Criada, acesso liberado");
                  res.redirect("/dashboard");
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });

          // console.log(newUser);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true
  })(req, res, next);
});

//logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Você saiu da sua conta");
  res.redirect("/auth/login");
});

module.exports = router;
