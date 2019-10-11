const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Jovem = new Schema({
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: Number
  },
  idade: {
    type: Number,
    required: true
  },
  estaca: {
    type: String,
    required: true
  },
  ala: {
    type: String
  },
  cmis: {
    type: String
  },
  sexo: {
    type: String,
    enum: ["M", "F"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  companhia: {
    type: Schema.Types.ObjectId,
    ref: "companhias"
  }
});
mongoose.model("jovens", Jovem);
