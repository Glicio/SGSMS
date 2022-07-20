const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: false,
  },
  password_hash: {
    type: String,
    required: true,
  },

  canUseFarmacia: Boolean,
  canUseMarcacao: Boolean,
  isAdmin: Boolean,
});

module.exports.UserSchema = UserSchema;
