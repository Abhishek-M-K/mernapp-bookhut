const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserScheme = new Schema({
  name: String,
  //email: String,
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model("User", UserScheme);

module.exports = UserModel;
