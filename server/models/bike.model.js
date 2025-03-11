import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "Brand is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  picture: {
    type: String,
    required: [true, "Picture is required"],
  },
});

const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;
