const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Companhia = new Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
mongoose.model("companhias", Companhia);
