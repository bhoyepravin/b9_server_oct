const {
  QuestionnaireResponse,
  Appointment,
  User,
  Questionnaire,
} = require("../models");

const questionnaireResponseController = {
  // Get all questionnaire responses
  getAllResponses: async (req, res) => {
    try {
      const responses = await QuestionnaireResponse.findAll({
        include: [
          {
            model: Appointment,
            as: "ResponseAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
          {
            model: User,
            as: "ResponseUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Questionnaire,
            as: "ResponseQuestionnaire",
            attributes: ["id", "title", "description"],
          },
        ],
      });
      res.json(responses);
    } catch (error) {
      console.error("Error fetching questionnaire responses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get response by ID
  getResponseById: async (req, res) => {
    try {
      const response = await QuestionnaireResponse.findByPk(req.params.id, {
        include: [
          {
            model: Appointment,
            as: "ResponseAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
          {
            model: User,
            as: "ResponseUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Questionnaire,
            as: "ResponseQuestionnaire",
            attributes: ["id", "title", "description"],
          },
        ],
      });

      if (!response) {
        return res
          .status(404)
          .json({ error: "Questionnaire response not found" });
      }

      res.json(response);
    } catch (error) {
      console.error("Error fetching questionnaire response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new questionnaire response
  createResponse: async (req, res) => {
    try {
      const { appointmentId, userId, questionnaireId, responses } = req.body;

      const questionnaireResponse = await QuestionnaireResponse.create({
        appointmentId,
        userId,
        questionnaireId,
        responses,
      });

      res.status(201).json(questionnaireResponse);
    } catch (error) {
      console.error("Error creating questionnaire response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update questionnaire response
  updateResponse: async (req, res) => {
    try {
      const { id } = req.params;
      const { responses } = req.body;

      const questionnaireResponse = await QuestionnaireResponse.findByPk(id);
      if (!questionnaireResponse) {
        return res
          .status(404)
          .json({ error: "Questionnaire response not found" });
      }

      await questionnaireResponse.update({
        responses,
      });

      res.json(questionnaireResponse);
    } catch (error) {
      console.error("Error updating questionnaire response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete questionnaire response
  deleteResponse: async (req, res) => {
    try {
      const { id } = req.params;

      const questionnaireResponse = await QuestionnaireResponse.findByPk(id);
      if (!questionnaireResponse) {
        return res
          .status(404)
          .json({ error: "Questionnaire response not found" });
      }

      await questionnaireResponse.destroy();
      res.json({ message: "Questionnaire response deleted successfully" });
    } catch (error) {
      console.error("Error deleting questionnaire response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get responses by user ID
  getResponsesByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const responses = await QuestionnaireResponse.findAll({
        where: { userId },
        include: [
          {
            model: Questionnaire,
            as: "ResponseQuestionnaire",
            attributes: ["id", "title", "description"],
          },
          {
            model: Appointment,
            as: "ResponseAppointment",
            attributes: ["id", "scheduledAt", "location"],
          },
        ],
      });

      res.json(responses);
    } catch (error) {
      console.error("Error fetching user responses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get responses by appointment ID
  getResponsesByAppointmentId: async (req, res) => {
    try {
      const { appointmentId } = req.params;

      const responses = await QuestionnaireResponse.findAll({
        where: { appointmentId },
        include: [
          {
            model: Questionnaire,
            as: "ResponseQuestionnaire",
            attributes: ["id", "title", "description"],
          },
          {
            model: User,
            as: "ResponseUser",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      res.json(responses);
    } catch (error) {
      console.error("Error fetching appointment responses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = questionnaireResponseController;
