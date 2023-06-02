const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String }, // new field to store Google ID
    role: { type: String, default: "member" },
  },
  {
    collection: "users",
  }
);

schema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

schema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

const user = mongoose.model("User", schema);

module.exports = user;
