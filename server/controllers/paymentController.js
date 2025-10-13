const { Payment, Client, Appointment } = require("../models");
const { Op } = require("sequelize");

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { clientId, appointmentId, stripePaymentId, amount, status } =
      req.body;

    // Validate required fields
    if (!clientId || !stripePaymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "clientId, stripePaymentId, and amount are required fields",
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check if client exists
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if appointment exists if provided
    if (appointmentId) {
      const appointment = await Appointment.findByPk(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }
    }

    // Check if stripePaymentId already exists
    const existingPayment = await Payment.findOne({
      where: { stripePaymentId },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment with this Stripe ID already exists",
      });
    }

    const payment = await Payment.create({
      clientId,
      appointmentId,
      stripePaymentId,
      amount,
      status: status || "pending",
    });

    // Fetch the payment with related data
    const newPayment = await Payment.findByPk(payment.id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, stripePaymentId } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Validate amount if provided
    if (amount && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check if stripePaymentId already exists (if changing)
    if (stripePaymentId && stripePaymentId !== payment.stripePaymentId) {
      const existingPayment = await Payment.findOne({
        where: { stripePaymentId },
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: "Payment with this Stripe ID already exists",
        });
      }
    }

    await payment.update({
      ...(status && { status }),
      ...(amount && { amount }),
      ...(stripePaymentId && { stripePaymentId }),
    });

    // Fetch updated payment with related data
    const updatedPayment = await Payment.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payment",
      error: error.message,
    });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.destroy();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting payment",
      error: error.message,
    });
  }
};

// Get payments by client ID
exports.getPaymentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check if client exists
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const payments = await Payment.findAll({
      where: { clientId },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error fetching client payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching client payments",
      error: error.message,
    });
  }
};

// Get payments by appointment ID
exports.getPaymentsByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Check if appointment exists
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const payments = await Payment.findAll({
      where: { appointmentId },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error fetching appointment payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment payments",
      error: error.message,
    });
  }
};

// Get payments by status
exports.getPaymentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = [
      "pending",
      "completed",
      "failed",
      "refunded",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const payments = await Payment.findAll({
      where: { status },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error fetching payments by status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments by status",
      error: error.message,
    });
  }
};

// Get payments by date range
exports.getPaymentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate query parameters are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)",
      });
    }

    const payments = await Payment.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error fetching payments by date range:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments by date range",
      error: error.message,
    });
  }
};

// Get payment statistics
exports.getPaymentStatistics = async (req, res) => {
  try {
    const totalPayments = await Payment.count();
    const totalAmount = await Payment.sum("amount");
    const completedPayments = await Payment.count({
      where: { status: "completed" },
    });
    const pendingPayments = await Payment.count({
      where: { status: "pending" },
    });
    const failedPayments = await Payment.count({ where: { status: "failed" } });

    // Get total amount by status
    const completedAmount = await Payment.sum("amount", {
      where: { status: "completed" },
    });
    const pendingAmount = await Payment.sum("amount", {
      where: { status: "pending" },
    });

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        totalAmount: totalAmount || 0,
        completedPayments,
        pendingPayments,
        failedPayments,
        completedAmount: completedAmount || 0,
        pendingAmount: pendingAmount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment statistics",
      error: error.message,
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "completed",
      "failed",
      "refunded",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status is required. Must be one of: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.update({ status });

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
      error: error.message,
    });
  }
};
