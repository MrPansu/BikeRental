import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  selfie: {
    type: String,
    required: [true, "Selfie is required"],
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
