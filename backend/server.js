import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongo } from './src/services/mongo.js';
import merchantRoutes from './src/routes/merchantRoutes.js';
import buyerRoutes from './src/routes/buyerRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import itemRoutes from './src/routes/itemRoutes.js';

const app = express();
const port = 3001;

// Connect to MongoDB when the server starts
connectToMongo();

const corsOptions = {
  origin: ["http://localhost:3000", process.env.FINIX_API_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(json()); // For parsing application/json

// Use the new route files
app.use(merchantRoutes);
app.use(buyerRoutes);
app.use(paymentRoutes);
app.use(itemRoutes);

app.get("/", (req, res) => {
  res.send("Simple Finix Backend is running!");
});

app.listen(port, () => {
  console.log(`Simple backend listening at http://localhost:${port}`);
});
