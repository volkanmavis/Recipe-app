const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully!" });
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id, message: "User login successfully!" });
});

module.exports = router;
