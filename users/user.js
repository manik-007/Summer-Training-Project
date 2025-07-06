const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MongoData).then(() => console.log("Connected!"));

const UseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: { type: String, unique: true },
});

UseSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: true,
});

const User = mongoose.model("User", UseSchema);
module.exports = User;
