const express = require("express");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Schema.ObjectId



const router = express.Router();

//models
require("../models/Jovem");
const Jovem = mongoose.model("jovens");

require("../models/Companhia");
const Companhia = mongoose.model("companhias");

//listagem de jovens
router.get("/", async (req, res) => {

  let retorno = [];
  let naodesignados = []
 
 /*  let engenheiros = await Jovem.find({companhia:"5da09fd721f4dc0004748484"})
 .then(jovens => {
   if(jovens){
    retorno.push(jovens) 
   }
    
  }).catch(err => {
    console.log(err)
  }) */

  //nao designados



 
  let jovem = Jovem.find({companhia : "5d9a730a7d6c050004d6572e"}).then(jovem => {
    console.log(jovem)
  }).catch(err => {
    console.log(err)
  })
  
  
 
 
 




  Jovem.find()
    .sort({ idade: "asc" })
    .populate("companhia")
    .then(async jovens => {

    
      

/* 
      let teste = await Jovem.find({companhia: ObjectId("507c35dd8fada716c89d0013")})
    let naodesignado = await Jovem.count()
    let jedis = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let sputnik = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let autobots = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let flinstones = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let fenix = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let jaspion = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let transformers = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let robocop = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let mortalidade = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let skywalker = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let padawans = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let atari = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let thundercats = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let engenheiros = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let caverna = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let solocorazon = await Jovem.countDocuments({companhia: "5d9a730a7d6c050004d6572e"})
    let orionte = await Jovem.count({companhia: "5d9a730a7d6c050004d6572e"},function(count) { } )
  console.dir(teste) */
      res.render("jovem/lista-jovens", { 
        jovens: jovens,
       /*  naodesignado: naodesignado,
        jedis:jedis,
        sputnik: sputnik,
        autobots:autobots,
        flinstones: flinstones,
        fenix:fenix,
        jaspion:jaspion,
        transformers:transformers,
        robocop:robocop,
        mortalidade: mortalidade,
        skywalker: skywalker,
        padawans: padawans,
        atari: atari,
        thundercats: thundercats,
        engenheiros: engenheiros,
        caverna: caverna,
        solocorazon: solocorazon,
        orionte: orionte */
       });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/estaca", (req, res) => {
  res.render("jovem/lista-jovens-estaca");
});

router.post("/busca", (req, res) => {
  let busca = req.body.busca;

  //validação se busca está vazio
  if (!busca || busca === "" || busca == undefined) {
    //se busca for vazio basta recarrecar a página novamente
    Jovem.find()
      .sort({ idade: "asc" })
      .populate("companhia")
      .then(jovens => {
        res.render("jovem/lista-jovens", { jovens: jovens });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    //busca = "/" + busca + "/i";
    //se não for vazio será uma procura de alguma pessoa
    Jovem.find({ nome: { $regex: busca, $options: "i" } })
      .populate("companhia")
      .then(jovens => {
        res.render("jovem/lista-jovens", { jovens: jovens });
      })
      .catch(err => {
        console.log(err);
      });
  }
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

  nome = nome.toUpperCase()
  estaca = estaca.toUpperCase()
  ala = ala.toUpperCase()
  

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
          if (!companhia) {
            companhia = "529f093e591f90ec628b4568";

            const novoJovem = new Jovem({
              nome,
              telefone,
              idade,
              sexo,
              companhia,
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

//rota post de editar jovem
router.post("/editar", (req, res) => {
  console.log(req.body);
  const {
    id,
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

  Jovem.findOne({ _id: id })
    .then(jovem => {
      (jovem.nome = nome),
        (jovem.telefone = telefone),
        (jovem.sexo = sexo),
        (jovem.estaca = estaca),
        (jovem.ala = ala),
        (jovem.cmis = cmis),
        (jovem.idade = idade),
        (jovem.companhia = companhia);

      jovem
        .save()
        .then(() => {
          req.flash("success_msg", "Jovem Editado");
          res.redirect("/dashboard/jovens/");
        })
        .catch(erro => {
          errors.push({ msg: "A operação encontrou um erro na edição" });
          console.log("erro de edição da jovem: console: " + erro);
          res.redirect("/dashboard/jovens");
        });
    })
    .catch(erro => {
      errors.push({ msg: "A operação possui erros e foi finalizada" });
      console.log("erro de edição da jovem: console: " + erro);
      res.redirect("/dashboard/jovens/");
    });
});

module.exports = router;
