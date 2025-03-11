import mongoose from "mongoose";
import Bike from "../models/bike.model.js";

export const getAllBike = async (req, res) => {
  try {
    const bike = await Bike.find({});
    res.status(200).json({ success: true, data: bike });
  } catch (error) {
    console.error("Failed getting bike," + error);
    res.status(500).json({
      success: false,
      message: "Failed getting bike",
      error: error.message,
    });
  }
};

export const createBike = async (req, res) => {
  const bike = req.body;

  if (!bike.brand || !bike.price || !bike.amount || !bike.picture) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all data" });
  }

  const newBike = await Bike(bike);

  try {
    await newBike.save();
    res.status(200).json({
      success: true,
      message: "Bike added successfully",
      data: newBike,
    });
  } catch (error) {
    console.error("Failed adding bike, " + error);
    res.status(500).json({
      success: false,
      message: "Failed adding bike",
      error: error.message,
    });
  }
};

export const deleteBike = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    if (!(await Bike.findById(id))) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }

    await Bike.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Bike deleted" });
  } catch (error) {
    console.error("Failed deleting bike, " + error);
    res.status(500).json({
      success: false,
      message: "Failed deleting bike",
      error: error.message,
    });
  }
};

export const updateBike = async (req, res) => {
  const { id } = req.params;
  const bike = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    if (!(await Bike.findById(id))) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }

    const updatedBike = await Bike.findByIdAndUpdate(id, bike, { new: true });
    res.status(200).json({
      success: true,
      message: "Bike updated successfully",
      data: updatedBike,
    });
  } catch (error) {
    console.error("Fail updating bike, " + error);
    res.status(500).json({
      success: false,
      message: "Failed updating bike",
      error: error.message,
    });
  }
};
