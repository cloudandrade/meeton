const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//models
require("../models/Jovem");
const Jovem = mongoose.model("jovens");

require("../models/Companhia");
const Companhia = mongoose.model("companhias");

//listagem de jovens
router.get("/", (req, res) => {
  Jovem.find()
    .populate("companhia")
    .then(jovens => {
      res.render("jovem/lista-jovens", { jovens: jovens });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/estaca", (req, res) => {
  res.render("jovem/lista-jovens-estaca");
});

router.post("/estaca", (req, res) => {
  const { estaca } = req.body;

  Jovem.find({ estaca: estaca })
    .then(jovens => {
      res.render("jovem/lista-jovens-estaca", { jovens: jovens });
    })
    .catch(err => {
      console.log(err);
    });
});

//cadastro de jovens
router.get("/cadastro", (req, res) => {
  Companhia.find()
    .then(companhias => {
      res.render("jovem/cadastro-jovem", { companhias: companhias });
    })
    .catch(error => {
      console.log(erro);
      res.redirect("/dashboard");
    });
});

//tratativa de cadastro de jovem
router.post("/cadastro", (req, res) => {
  const {
    nome,
    telefone,
    sexo,
    estaca,
    ala,
    cmis,
    idade,
    companhia
  } = req.body;
  let errors = [];

  //check required fields
  if (!nome || !sexo || !idade || !estaca) {
    errors.push({ msg: "Porfavor preencha todos os campos marcados com *" });
  }

  if (errors.length > 0) {
    res.render("jovem/cadastro-jovem", {
      errors,
      nome,
      telefone,
      idade,
      sexo,
      cmis,
      estaca,
      ala
    });
  } else {
    //validation passed
    Jovem.findOne({ nome: nome })
      .then(jovem => {
        if (jovem) {
          //user exists
          errors.push({ msg: "Jovem já cadastrado" });
          res.render("jovem/cadastro-jovem", {
            errors,
            nome,
            telefone,
            companhia,
            idade,
            sexo,
            cmis,
            estaca,
            ala
          });
        } else {
          const novoJovem = new Jovem({
            nome,
            telefone,
            companhia,
            idade,
            sexo,
            cmis,
            estaca,
            ala
          });

          novoJovem
            .save()
            .then(jovemCreated => {
              req.flash("success_msg", "Jovem cadastrado");
              res.redirect("/dashboard/jovens/cadastro");
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

//rota para edição de  jovem
router.get("/editar/:id", (req, res) => {
  Jovem.findOne({ _id: req.params.id })
    .then(jovem => {
      Companhia.find()
        .then(companhias => {
          res.render("jovem/editar-jovem", {
            companhias: companhias,
            jovem: jovem
          });
        })
        .catch(erro => {
          console.log(erro);
          res.redirect("/dashboard");
        });
    })
    .catch(erro => {
      req.flash("error_msg", "Houve um erro ao carregar formulário de edição");
      console.log("Erro de busca em editar categoria: console: " + erro);
      res.redirect("/admin/postagens");
    });
});

module.exports = router;
