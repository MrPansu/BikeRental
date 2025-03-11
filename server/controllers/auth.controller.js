import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const user = req.body;

  if (!user.username || !user.email || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all data" });
  }
  if (user.password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 character",
    });
  }

  const newUser = await User(user);

  try {
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered", data: newUser });
  } catch (error) {
    console.error("Error registering", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all data" });
  }

  const user = await User.findOne({ email });

  try {
    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      message: "Login successfull",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({
      success: false,
      message: "Error when loggin in",
      error: error.message,
    });
  }
};
