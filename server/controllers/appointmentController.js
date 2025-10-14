const {
  Appointment,
  User,
  QuestionnaireResponse,
  Payment,
} = require("../models");

const appointmentController = {
  // Get all appointments
  getAllAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: User,
            as: "AppointmentClient",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            as: "AppointmentTherapist",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get appointment by ID
  getAppointmentById: async (req, res) => {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "AppointmentClient",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            as: "AppointmentTherapist",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: QuestionnaireResponse,
            as: "AppointmentResponses",
            include: ["ResponseQuestionnaire"],
          },
          {
            model: Payment,
            as: "AppointmentPayment",
          },
        ],
      });

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new appointment
  createAppointment: async (req, res) => {
    try {
      const { userId, therapistId, location, scheduledAt, notes, calendlyUrl } =
        req.body;

      const appointment = await Appointment.create({
        userId,
        therapistId,
        location,
        scheduledAt,
        notes,
        calendlyUrl,
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update appointment
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        userId,
        therapistId,
        location,
        scheduledAt,
        status,
        notes,
        calendlyUrl,
      } = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      await appointment.update({
        userId,
        therapistId,
        location,
        scheduledAt,
        status,
        notes,
        calendlyUrl,
      });

      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete appointment
  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      await appointment.destroy();
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get appointments by user ID
  getAppointmentsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const appointments = await Appointment.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: "AppointmentTherapist",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      res.json(appointments);
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get appointments by therapist ID
  getAppointmentsByTherapistId: async (req, res) => {
    try {
      const { therapistId } = req.params;

      const appointments = await Appointment.findAll({
        where: { therapistId },
        include: [
          {
            model: User,
            as: "AppointmentClient",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      res.json(appointments);
    } catch (error) {
      console.error("Error fetching therapist appointments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = appointmentController;
