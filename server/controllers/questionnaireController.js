const { Questionnaire, User } = require("../models");
const { Op } = require("sequelize");

// Get all questionnaires
exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll({
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: questionnaires,
      count: questionnaires.length,
    });
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questionnaires",
      error: error.message,
    });
  }
};

// Get questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id, {
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    res.status(200).json({
      success: true,
      data: questionnaire,
    });
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questionnaire",
      error: error.message,
    });
  }
};

// Create new questionnaire
exports.createQuestionnaire = async (req, res) => {
  try {
    const { title, description, questions, createdBy } = req.body;

    // Validate required fields
    if (!title || !questions || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Title, questions, and createdBy are required fields",
      });
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array",
      });
    }

    // Check if user exists
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const questionnaire = await Questionnaire.create({
      title,
      description,
      questions,
      createdBy,
    });

    // Fetch the questionnaire with creator data using the association
    const newQuestionnaire = await Questionnaire.findByPk(questionnaire.id, {
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Questionnaire created successfully",
      data: newQuestionnaire,
    });
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Error creating questionnaire",
      error: error.message,
    });
  }
};

// Rest of your controller methods remain the same...
exports.updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;

    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    // Validate questions structure if provided
    if (questions && (!Array.isArray(questions) || questions.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array",
      });
    }

    await questionnaire.update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(questions && { questions }),
    });

    // Fetch updated questionnaire with creator data
    const updatedQuestionnaire = await Questionnaire.findByPk(id, {
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Questionnaire updated successfully",
      data: updatedQuestionnaire,
    });
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Error updating questionnaire",
      error: error.message,
    });
  }
};

// Delete questionnaire
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    await questionnaire.destroy();

    res.status(200).json({
      success: true,
      message: "Questionnaire deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting questionnaire",
      error: error.message,
    });
  }
};

// Get questionnaires by user ID
exports.getQuestionnairesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const questionnaires = await Questionnaire.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: questionnaires,
      count: questionnaires.length,
    });
  } catch (error) {
    console.error("Error fetching user questionnaires:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user questionnaires",
      error: error.message,
    });
  }
};
