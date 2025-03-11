import mongoose from "mongoose";
import Customer from "../models/customer.model.js";

export const getAllCustomer = async (req, res) => {
  try {
    const customer = await Customer.find({});
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error("Failed getting customer," + error);
    res.status(500).json({
      success: false,
      message: "Failed getting customer",
      error: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  const customer = req.body;

  if (
    !customer.name ||
    !customer.phone ||
    !customer.address ||
    !customer.selfie
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all data" });
  }

  const newCustomer = await Customer(customer);

  try {
    await newCustomer.save();
    res.status(200).json({
      success: true,
      message: "Customer added successfully",
      data: newCustomer,
    });
  } catch (error) {
    console.error("Failed adding customer, " + error);
    res.status(500).json({
      success: false,
      message: "Failed adding customer",
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    if (!(await Customer.findById(id))) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }

    await Customer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Customer deleted" });
  } catch (error) {
    console.error("Failed deleting customer, " + error);
    res.status(500).json({
      success: false,
      message: "Failed deleting customer",
      error: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    if (!(await Customer.findById(id))) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    console.error("Fail updating customer, " + error);
    res.status(500).json({
      success: false,
      message: "Failed updating customer",
      error: error.message,
    });
  }
};
