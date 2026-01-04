import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getBalance,
  withdraw,
  deposit,
  deleteAccount,
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/balance", auth, getBalance);
router.post("/withdraw", auth, withdraw);
router.post("/deposit", auth, deposit);
router.delete("/delete", auth, deleteAccount);
export default router;
