const express = require("express");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
//const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const handlebars = require("express-handlebars");

//passport config
require("./config/passport")(passport);

//EXPRESS
const app = express();

//SERVER PORT
const PORT = process.env.PORT || 5000;

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" })); //definindo o arquivo principal de configuração do handlebars
app.set("view engine", "handlebars"); //definindo o handlebars como ferramenta de frontent
app.use(express.static(path.join(__dirname, "public"))); //fala pra o app que todos os arquivos estáticos estão na pasta public

//ROUTES
app.use("/", require("./routes/index"));

//MONGO ONLINE
 const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("AtlasDb Connected..."))
  .catch(err => {
    console.log("Falha ao conectar ao AtlasDb");
    console.log(err);
  }); 

/* //MONGOOSE
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/passport", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongodb connected...");
  })
  .catch(erro => {
    console.log(
      "houve um problema ao se conectar ao banco de dados, erro: " + erro
    );
  });
 */
//SERVER
app.listen(
  process.env.port || PORT,
  console.log(`Server started on port ${PORT}`)
);
