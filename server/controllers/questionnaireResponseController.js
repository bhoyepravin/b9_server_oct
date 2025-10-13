const {
  QuestionnaireResponse,
  Questionnaire,
  Client,
  Appointment,
  User,
} = require("../models");
const { Op } = require("sequelize");

// Get all questionnaire responses
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await QuestionnaireResponse.findAll({
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description"],
        },
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["submittedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching questionnaire responses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questionnaire responses",
      error: error.message,
    });
  }
};

// Get response by ID
exports.getResponseById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await QuestionnaireResponse.findByPk(id, {
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description", "questions"],
        },
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

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire response not found",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching questionnaire response:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questionnaire response",
      error: error.message,
    });
  }
};

// Create new questionnaire response
exports.createResponse = async (req, res) => {
  try {
    const { appointmentId, clientId, questionnaireId, responses } = req.body;

    // Validate required fields
    if (!appointmentId || !clientId || !questionnaireId || !responses) {
      return res.status(400).json({
        success: false,
        message:
          "appointmentId, clientId, questionnaireId, and responses are required fields",
      });
    }

    // Validate responses structure
    if (typeof responses !== "object" || Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "Responses must be an object",
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
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

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findByPk(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    // Check if response already exists for this appointment and questionnaire
    const existingResponse = await QuestionnaireResponse.findOne({
      where: {
        appointmentId,
        questionnaireId,
      },
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message:
          "Response already submitted for this appointment and questionnaire",
      });
    }

    // Validate responses against questionnaire structure
    const validationResult = await validateResponses(
      questionnaire.questions,
      responses
    );
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Response validation failed",
        errors: validationResult.errors,
      });
    }

    const questionnaireResponse = await QuestionnaireResponse.create({
      appointmentId,
      clientId,
      questionnaireId,
      responses,
    });

    // Fetch the response with related data
    const newResponse = await QuestionnaireResponse.findByPk(
      questionnaireResponse.id,
      {
        include: [
          {
            model: Questionnaire,
            attributes: ["id", "title", "description"],
          },
          {
            model: Client,
            attributes: ["id", "name", "email"],
          },
          {
            model: Appointment,
            attributes: ["id", "location", "scheduledAt"],
          },
        ],
      }
    );

    res.status(201).json({
      success: true,
      message: "Questionnaire response submitted successfully",
      data: newResponse,
    });
  } catch (error) {
    console.error("Error creating questionnaire response:", error);
    res.status(500).json({
      success: false,
      message: "Error creating questionnaire response",
      error: error.message,
    });
  }
};

// Update questionnaire response
exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const response = await QuestionnaireResponse.findByPk(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire response not found",
      });
    }

    // Validate responses structure if provided
    if (
      responses &&
      (typeof responses !== "object" || Array.isArray(responses))
    ) {
      return res.status(400).json({
        success: false,
        message: "Responses must be an object",
      });
    }

    // Get questionnaire to validate responses
    if (responses) {
      const questionnaire = await Questionnaire.findByPk(
        response.questionnaireId
      );
      if (questionnaire) {
        const validationResult = await validateResponses(
          questionnaire.questions,
          responses
        );
        if (!validationResult.isValid) {
          return res.status(400).json({
            success: false,
            message: "Response validation failed",
            errors: validationResult.errors,
          });
        }
      }
    }

    await response.update({
      ...(responses && { responses }),
    });

    // Fetch updated response with related data
    const updatedResponse = await QuestionnaireResponse.findByPk(id, {
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description"],
        },
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
      message: "Questionnaire response updated successfully",
      data: updatedResponse,
    });
  } catch (error) {
    console.error("Error updating questionnaire response:", error);
    res.status(500).json({
      success: false,
      message: "Error updating questionnaire response",
      error: error.message,
    });
  }
};

// Delete questionnaire response
exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await QuestionnaireResponse.findByPk(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire response not found",
      });
    }

    await response.destroy();

    res.status(200).json({
      success: true,
      message: "Questionnaire response deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting questionnaire response:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting questionnaire response",
      error: error.message,
    });
  }
};

// Get responses by appointment ID
exports.getResponsesByAppointment = async (req, res) => {
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

    const responses = await QuestionnaireResponse.findAll({
      where: { appointmentId },
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description"],
        },
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["submittedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching appointment responses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment responses",
      error: error.message,
    });
  }
};

// Get responses by client ID
exports.getResponsesByClient = async (req, res) => {
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

    const responses = await QuestionnaireResponse.findAll({
      where: { clientId },
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["submittedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching client responses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching client responses",
      error: error.message,
    });
  }
};

// Get responses by questionnaire ID
exports.getResponsesByQuestionnaire = async (req, res) => {
  try {
    const { questionnaireId } = req.params;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findByPk(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    const responses = await QuestionnaireResponse.findAll({
      where: { questionnaireId },
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
      order: [["submittedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching questionnaire responses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questionnaire responses",
      error: error.message,
    });
  }
};

// Get responses by date range
exports.getResponsesByDateRange = async (req, res) => {
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

    const responses = await QuestionnaireResponse.findAll({
      where: {
        submittedAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Questionnaire,
          attributes: ["id", "title", "description"],
        },
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
        {
          model: Appointment,
          attributes: ["id", "location", "scheduledAt"],
        },
      ],
      order: [["submittedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching responses by date range:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching responses by date range",
      error: error.message,
    });
  }
};

// Response validation helper function
async function validateResponses(questions, responses) {
  const errors = [];

  if (!questions || !Array.isArray(questions)) {
    errors.push("Invalid questionnaire structure");
    return { isValid: false, errors };
  }

  // Check if all required questions are answered
  questions.forEach((question, index) => {
    const questionKey = `question_${index}`;

    if (
      question.required &&
      (responses[questionKey] === undefined || responses[questionKey] === "")
    ) {
      errors.push(
        `Required question "${question.questionText}" is not answered`
      );
      return;
    }

    if (responses[questionKey] !== undefined) {
      // Validate based on question type
      switch (question.type) {
        case "multiple_choice":
        case "dropdown":
          if (!question.options.includes(responses[questionKey])) {
            errors.push(
              `Invalid answer for question "${question.questionText}"`
            );
          }
          break;

        case "checkbox":
          if (
            !Array.isArray(responses[questionKey]) ||
            !responses[questionKey].every((opt) =>
              question.options.includes(opt)
            )
          ) {
            errors.push(
              `Invalid answers for question "${question.questionText}"`
            );
          }
          break;

        case "scale":
          const numResponse = Number(responses[questionKey]);
          if (
            isNaN(numResponse) ||
            numResponse < question.min ||
            numResponse > question.max
          ) {
            errors.push(
              `Answer for question "${question.questionText}" must be between ${question.min} and ${question.max}`
            );
          }
          break;

        case "text":
          // Basic text validation - ensure it's a string
          if (typeof responses[questionKey] !== "string") {
            errors.push(
              `Answer for question "${question.questionText}" must be text`
            );
          }
          break;
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
