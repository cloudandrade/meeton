const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//models
require("../models/Companhia");
const Companhia = mongoose.model("companhias");

require("../models/Jovem");
const Jovem = mongoose.model("jovens");

require("../models/Consultor");
const Consultor = mongoose.model("consultores");

//Lista de companhias
router.get("/", (req, res) => {
  Companhia.find()
    .then(companhias => {
      res.render("companhia/lista-companhias", { companhias: companhias });
    })
    .catch(err => {
      console.log(err);
    });
});

//cadastro de companhia
router.get("/cadastro", (req, res) => {
  res.render("companhia/criar-companhia");
});

//tratativa de cadastro
router.post("/cadastro", (req, res) => {
  const { nome, descricao } = req.body;
  let errors = [];

  //check required fields
  if (!nome) {
    errors.push({ msg: "Companhia precisa ter um nome" });
  }

  //se houver erros recarrega a página
  if (errors.length > 0) {
    res.render("companhia/criar-companhia", {
      errors,
      nome,
      descricao
    });
  } else {
    //passou na validação
    Companhia.findOne({ nome: nome })
      .then(companhia => {
        if (companhia) {
          //companhia existe
          errors.push({ msg: "Já existe um companhia com esse nome" });
          res.render("companhia/criar-companhia", {
            errors,
            nome,
            descricao
          });
        } else {
          const novaCompanhia = new Companhia({
            nome,
            descricao
          });

          novaCompanhia
            .save()
            .then(companhiaCriada => {
              req.flash("success_msg", "Companhia Criada com sucesso");
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

//grupos das companhias
router.get("/grupos", (req, res) => {
  Companhia.find()
    .then(companhias => {
      Consultor.find()
        /*  .populate("companhia") */
        .then(consultores => {
          res.render("companhia/companhia-grupos", {
            companhias: companhias,
            consultores: consultores
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/dashboard");
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/dashboard");
    });
});

module.exports = router;
