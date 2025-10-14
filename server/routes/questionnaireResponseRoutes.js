const express = require("express");
const router = express.Router();
const questionnaireResponseController = require("../controllers/questionnaireResponseController");

router.get("/", questionnaireResponseController.getAllResponses);
router.get("/:id", questionnaireResponseController.getResponseById);
router.post("/create", questionnaireResponseController.createResponse);
router.put("/:id", questionnaireResponseController.updateResponse);
router.delete("/:id", questionnaireResponseController.deleteResponse);
router.get(
  "/user/:userId",
  questionnaireResponseController.getResponsesByUserId
);
router.get(
  "/appointment/:appointmentId",
  questionnaireResponseController.getResponsesByAppointmentId
);

module.exports = router;
