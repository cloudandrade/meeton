const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Consultor = new Schema({
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: Number
  },
  estaca: {
    type: String,
    required: true
  },
  ala: {
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
mongoose.model("consultores", Consultor);
