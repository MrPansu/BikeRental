import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transaction = await Transaction.find({})
      .populate("customer", "name")
      .populate("bike", "brand");

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("Fail getting transaction, " + error);
    res.status(500).json({
      success: false,
      message: "Fail getting transaction",
      error: error.message,
    });
  }
};

export const createTransaction = async (req, res) => {
  const transaction = req.body;

  if (
    !transaction.customer |
    !transaction.bike |
    !transaction.start_time |
    !transaction.end_time
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all data" });
  }

  const newTransaction = new Transaction(transaction);

  try {
    await newTransaction.save();
    res.status(201).json({
      success: true,
      message: "New transaction added",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Failed adding transaction", error.message);
    res.status(500).json({
      success: false,
      message: "Failed adding transaction",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res
        .status(400)
        .json({ success: false, message: "No transaction found" });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Transacion deleted",
    });
  } catch (error) {
    console.error("Failed deleting transaction, " + error);
    res.status(500).json({
      success: false,
      message: "Failed deleting transaction",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { ...newTransaction } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid Id" });
  }

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res
        .status(400)
        .json({ success: false, message: "No transaction found" });
    }

    Object.assign(transaction, newTransaction);
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transacion updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Fail updating transaction, " + error);
    res.status(500).json({
      success: false,
      message: "Failed updating transaction",
      error: error.message,
    });
  }
};
