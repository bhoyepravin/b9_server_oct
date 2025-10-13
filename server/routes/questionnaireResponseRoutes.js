const express = require("express");
const router = express.Router();
const questionnaireResponseController = require("../controllers/questionnaireResponseController");

// GET /api/questionnaire-responses - Get all responses
router.get("/", questionnaireResponseController.getAllResponses);

// GET /api/questionnaire-responses/range - Get responses by date range
router.get("/range", questionnaireResponseController.getResponsesByDateRange);

// GET /api/questionnaire-responses/appointment/:appointmentId - Get responses by appointment
router.get(
  "/appointment/:appointmentId",
  questionnaireResponseController.getResponsesByAppointment
);

// GET /api/questionnaire-responses/client/:clientId - Get responses by client
router.get(
  "/client/:clientId",
  questionnaireResponseController.getResponsesByClient
);

// GET /api/questionnaire-responses/questionnaire/:questionnaireId - Get responses by questionnaire
router.get(
  "/questionnaire/:questionnaireId",
  questionnaireResponseController.getResponsesByQuestionnaire
);

// GET /api/questionnaire-responses/:id - Get response by ID
router.get("/:id", questionnaireResponseController.getResponseById);

// POST /api/questionnaire-responses - Create new response
router.post("/create", questionnaireResponseController.createResponse);

// PUT /api/questionnaire-responses/:id - Update response
router.put("/:id", questionnaireResponseController.updateResponse);

// DELETE /api/questionnaire-responses/:id - Delete response
router.delete("/:id", questionnaireResponseController.deleteResponse);

module.exports = router;
