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

// const express = require("express");
// const router = express.Router();
// const {
//   transfer,
//   getTransactionHistory,
// } = require("../controllers/transactionController");
// const {
//   validateRequest,
//   transferSchema,
// } = require("../middlewares/validation");
// const { protect } = require("../middlewares/auth");

// router.post("/transfer", protect, validateRequest(transferSchema), transfer);
// router.get("/history", protect, getTransactionHistory);
// // router.get('/:id', protect, getTransaction);

// module.exports = router;
