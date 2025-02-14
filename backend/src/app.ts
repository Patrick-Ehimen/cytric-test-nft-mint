import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
// import { connectMongoDB } from "./config/database";
import nftRoutes from "./routes/nft.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

dotenv.config();

const app = express();
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nftDB";

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
// connectMongoDB();
// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// API Routes
app.use("/api", nftRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler (optional – you can also create a dedicated middleware in src/middlewares/errorHandler.ts)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
