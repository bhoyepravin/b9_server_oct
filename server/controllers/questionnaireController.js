const { Questionnaire, User, QuestionnaireResponse } = require("../models");

const questionnaireController = {
  // Get all questionnaires
  getAllQuestionnaires: async (req, res) => {
    try {
      const questionnaires = await Questionnaire.findAll({
        include: [
          {
            model: User,
            as: "QuestionnaireCreator",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });
      res.json(questionnaires);
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get questionnaire by ID
  getQuestionnaireById: async (req, res) => {
    try {
      const questionnaire = await Questionnaire.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "QuestionnaireCreator",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: QuestionnaireResponse,
            as: "QuestionnaireResponses",
            include: ["ResponseUser"],
          },
        ],
      });

      if (!questionnaire) {
        return res.status(404).json({ error: "Questionnaire not found" });
      }

      res.json(questionnaire);
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new questionnaire
  createQuestionnaire: async (req, res) => {
    try {
      const { title, description, questions, createdBy } = req.body;

      const questionnaire = await Questionnaire.create({
        title,
        description,
        questions,
        createdBy,
      });

      res.status(201).json(questionnaire);
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update questionnaire
  updateQuestionnaire: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, questions, isActive } = req.body;

      const questionnaire = await Questionnaire.findByPk(id);
      if (!questionnaire) {
        return res.status(404).json({ error: "Questionnaire not found" });
      }

      await questionnaire.update({
        title,
        description,
        questions,
        isActive,
      });

      res.json(questionnaire);
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete questionnaire
  deleteQuestionnaire: async (req, res) => {
    try {
      const { id } = req.params;

      const questionnaire = await Questionnaire.findByPk(id);
      if (!questionnaire) {
        return res.status(404).json({ error: "Questionnaire not found" });
      }

      await questionnaire.destroy();
      res.json({ message: "Questionnaire deleted successfully" });
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get questionnaires by creator
  getQuestionnairesByCreator: async (req, res) => {
    try {
      const { userId } = req.params;

      const questionnaires = await Questionnaire.findAll({
        where: { createdBy: userId },
        include: [
          {
            model: QuestionnaireResponse,
            as: "QuestionnaireResponses",
          },
        ],
      });

      res.json(questionnaires);
    } catch (error) {
      console.error("Error fetching user questionnaires:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = questionnaireController;
