import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  transferMoney,
  history,
} from "../controllers/transactionController.js";

const router = express.Router();
router.post("/transfer", auth, transferMoney);
router.get("/history", auth, history);
export default router;
