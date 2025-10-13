const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// GET /api/payments - Get all payments
router.get("/", paymentController.getAllPayments);

// GET /api/payments/statistics - Get payment statistics
router.get("/statistics", paymentController.getPaymentStatistics);

// GET /api/payments/range - Get payments by date range
router.get("/range", paymentController.getPaymentsByDateRange);

// GET /api/payments/client/:clientId - Get payments by client ID
router.get("/client/:clientId", paymentController.getPaymentsByClient);

// GET /api/payments/appointment/:appointmentId - Get payments by appointment ID
router.get(
  "/appointment/:appointmentId",
  paymentController.getPaymentsByAppointment
);

// GET /api/payments/status/:status - Get payments by status
router.get("/status/:status", paymentController.getPaymentsByStatus);

// GET /api/payments/:id - Get payment by ID
router.get("/:id", paymentController.getPaymentById);

// POST /api/payments - Create new payment
router.post("/create", paymentController.createPayment);

// PUT /api/payments/:id - Update payment
router.put("/:id", paymentController.updatePayment);

// PATCH /api/payments/:id/status - Update payment status
router.patch("/:id/status", paymentController.updatePaymentStatus);

// DELETE /api/payments/:id - Delete payment
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
