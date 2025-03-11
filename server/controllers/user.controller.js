import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error getting users", error.message);
    res.status(500).json({
      success: false,
      message: "Failed getting users",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
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

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    if (!(await User.findById(id))) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Failed deleting user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    if (userData.password) {
      if (userData.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
    }

    Object.assign(user, userData);

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated",
      data: user,
    });
  } catch (error) {
    console.error("Failed updating user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};
