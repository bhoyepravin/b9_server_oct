const { Appointment, Client } = require("../models");
const { Op } = require("sequelize");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { clientId, location, scheduledAt, calendlyUrl } = req.body;

    // Validate required fields
    if (!clientId || !location || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "clientId, location, and scheduledAt are required fields",
      });
    }

    // Validate scheduledAt is a future date
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment must be scheduled for a future date",
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

    // Check for scheduling conflicts (optional)
    const conflictingAppointment = await Appointment.findOne({
      where: {
        clientId,
        scheduledAt: {
          [Op.between]: [
            new Date(scheduledDate.getTime() - 30 * 60000), // 30 minutes before
            new Date(scheduledDate.getTime() + 30 * 60000), // 30 minutes after
          ],
        },
      },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Client already has an appointment scheduled around this time",
      });
    }

    const appointment = await Appointment.create({
      clientId,
      location,
      scheduledAt: scheduledDate,
      calendlyUrl,
    });

    // Fetch the appointment with client data
    const newAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.errors.map((e) => e.message),
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Invalid clientId",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, location, scheduledAt, calendlyUrl } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Validate scheduledAt is a future date if provided
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Appointment must be scheduled for a future date",
        });
      }
    }

    // Check if client exists if clientId is provided
    if (clientId) {
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    await appointment.update({
      ...(clientId && { clientId }),
      ...(location && { location }),
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      ...(calendlyUrl !== undefined && { calendlyUrl }),
    });

    // Fetch updated appointment with client data
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointment.destroy();

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

// Get appointments by client ID
exports.getAppointmentsByClient = async (req, res) => {
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

    const appointments = await Appointment.findAll({
      where: { clientId },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client appointments",
      error: error.message,
    });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        scheduledAt: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledAt", "ASC"]],
      limit: 50, // Limit to prevent too many results
    });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching upcoming appointments",
      error: error.message,
    });
  }
};

// Get appointments by date range
exports.getAppointmentsByDateRange = async (req, res) => {
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

    const appointments = await Appointment.findAll({
      where: {
        scheduledAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments by date range",
      error: error.message,
    });
  }
};
