const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//models
require("../models/Consultor");
const Consultor = mongoose.model("consultores");

require("../models/Companhia");
const Companhia = mongoose.model("companhias");

//listagem de consultores
router.get("/", (req, res) => {
  Consultor.find()
    .populate("companhia")
    .then(consultores => {
      res.render("consultor/lista-consultores", { consultores: consultores });
    })
    .catch(err => {
      console.log(err);
    });
});

//cadastro  de consultores
router.get("/cadastro", (req, res) => {
  Companhia.find()
    .then(companhias => {
      res.render("consultor/cadastro-consultor", { companhias: companhias });
    })
    .catch(error => {
      console.log(erro);
      res.redirect("/dashboard");
    });
});

//tratativa de cadastro de consultor
router.post("/cadastro", (req, res) => {
  const { nome, telefone, sexo, estaca, ala, companhia } = req.body;
  let errors = [];

  //check required fields
  if (!nome || !telefone || !sexo || !estaca || !ala) {
    errors.push({ msg: "Porfavor preencha todos os campos" });
  }

  if (errors.length > 0) {
    res.render("consultor/cadastro-consultor", {
      errors,
      nome,
      companhia,
      telefone,
      sexo,
      estaca,
      ala
    });
  } else {
    //validation passed
    Consultor.findOne({ telefone: telefone })
      .then(consultor => {
        if (consultor) {
          //user exists
          errors.push({ msg: "Já existe um consultor" });
          res.render("consultor/cadastro", {
            errors,
            nome,
            companhia,
            telefone,
            sexo,
            estaca,
            ala
          });
        } else {
          const novoConsultor = new Consultor({
            nome,
            telefone,
            companhia,
            sexo,
            estaca,
            ala
          });

          novoConsultor
            .save()
            .then(consultorCreated => {
              req.flash("success_msg", "Consultor cadastrado");
              res.redirect("/dashboard");
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = router;
