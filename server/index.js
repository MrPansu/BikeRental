import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import bikeRoute from "./routes/bike.routes.js";
import customerRoute from "./routes/customer.routes.js";
import transactionRoute from "./routes/transaction.routes.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/bike", bikeRoute);
app.use("/api/customer", customerRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(PORT, async () => {
  connectDB();
  console.log("App listening to: http://localhost:" + PORT);
});
