import mongoose from "mongoose";
import Bike from "./bike.model.js";

const transactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer is required"],
  },
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bike",
    required: [true, "Bike is required"],
  },
  start_time: {
    type: Date,
    required: [true, "Start time is required"],
  },
  end_time: {
    type: Date,
    required: [true, "End time is required"],
  },
  return_time: {
    type: Date,
    default: function () {
      return this.end_time;
    },
  },
  assurance: {
    type: Number,
    default: 10000,
  },
  fine: {
    type: Number,
    default: 2000,
  },
  total_fine: {
    type: Number,
    default: 0,
  },
  payment: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

transactionSchema.pre("save", async function (next) {
  if (this.return_time && this.end_time) {
    const return_time = new Date(this.return_time);
    const end_time = new Date(this.end_time);

    const late = Math.ceil((return_time - end_time) / (1000 * 60 * 60 * 24));

    this.total_fine = late > 0 ? late * this.fine : 0;
  }

  if (this.start_time && this.return_time) {
    const start_time = new Date(this.start_time);
    const return_time = new Date(this.return_time);

    const daysRental = Math.ceil(
      (return_time - start_time) / (1000 * 60 * 60 * 24)
    );

    const bike = await Bike.findById(this.bike);
    if (bike) {
      const bikePrice = parseFloat(bike.price);
      this.payment = daysRental * bikePrice + this.total_fine;
    }
  }

  if (this.isNew) {
    const bike = await Bike.findById(this.bike);
    if (bike) {
      bike.amount -= 1;
      await bike.save();
    }
  }

  next();
});

transactionSchema.post("save", async function (doc, next) {
  if (doc.status === "completed") {
    const bike = await Bike.findById(doc.bike);
    if (bike) {
      bike.amount += 1;
      await bike.save();
    }
  }

  if (doc.status === "pending") {
    const bike = await Bike.findById(doc.bike);
    if (bike) {
      bike.amount -= 1;
      await bike.save();
    }
  }

  next();
});

transactionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const bike = await Bike.findById(this.bike);
    if (bike) {
      bike.amount += 1;
      await bike.save();
    }
    next();
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
