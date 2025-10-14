const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.post("/create", paymentController.createPayment);
router.put("/:id", paymentController.updatePayment);
router.patch("/:id/status", paymentController.updatePaymentStatus);
router.delete("/:id", paymentController.deletePayment);
router.get("/user/:userId", paymentController.getPaymentsByUserId);
router.get("/status/:status", paymentController.getPaymentsByStatus);

module.exports = router;
