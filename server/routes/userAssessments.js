const express = require("express");
const router = express.Router();
const userAssessmentController = require("../controllers/userAssessmentController");

// Create user with assessment (all data at once)
router.post("/create", userAssessmentController.createUserWithAssessment);

// Add additional data to existing user
router.post(
  "/:userId/additional-data",
  userAssessmentController.addAdditionalData
);

// Get assessment by user ID
router.get("/user/:userId", userAssessmentController.getAssessmentByUserId);

// Get all assessments
router.get("/", userAssessmentController.getAllAssessments);

module.exports = router;
