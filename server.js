import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import accountRoutes from "./src/routes/accountRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url); //having current file's directory path (ES modules don't have __dirname by default).
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

/* static files */
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(express.static(path.join(__dirname, "src", "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "index.html"));
});

/* routes */
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/user", userRoutes);

/* error handler */
app.use(errorMiddleware);

const PORT = 3005;

sequelize.sync({ force: false }).then(() => {
  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
