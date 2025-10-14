const { Payment, User, Appointment } = require("../models");

const paymentController = {
  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: [
          {
            model: User,
            as: "PaymentUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Appointment,
            as: "PaymentAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
        ],
      });
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "PaymentUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Appointment,
            as: "PaymentAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
        ],
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new payment
  createPayment: async (req, res) => {
    try {
      const {
        userId,
        appointmentId,
        stripePaymentId,
        amount,
        currency,
        status,
      } = req.body;

      const payment = await Payment.create({
        userId,
        appointmentId,
        stripePaymentId,
        amount,
        currency,
        status,
      });

      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update payment
  updatePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { stripePaymentId, amount, status, currency } = req.body;

      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await payment.update({
        stripePaymentId,
        amount,
        status,
        currency,
      });

      res.json(payment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete payment
  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await payment.destroy();
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get payments by user ID
  getPaymentsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const payments = await Payment.findAll({
        where: { userId },
        include: [
          {
            model: Appointment,
            as: "PaymentAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
        ],
      });

      res.json(payments);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get payments by status
  getPaymentsByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      const payments = await Payment.findAll({
        where: { status },
        include: [
          {
            model: User,
            as: "PaymentUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments by status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await payment.update({ status });
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = paymentController;
