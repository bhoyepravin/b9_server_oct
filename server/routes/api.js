const router = require("express").Router();
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");
const appointmentController = require("../controllers/appointmentController");
const questionnaireController = require("../controllers/questionnaireController");
const paymentController = require("../controllers/paymentController");

router.post(
  "/clients",
  authenticateJWT,
  authorizeRoles("Admin"),
  clientController.createClient
);
router.post(
  "/appointments",
  authenticateJWT,
  authorizeRoles("Admin"),
  appointmentController.createAppointment
);

router.post(
  "/questionnaires",
  authenticateJWT,
  authorizeRoles("Admin"),
  questionnaireController.createQuestionnaire
);
router.post(
  "/appointments/:appointmentId/questionnaire",
  authenticateJWT,
  authorizeRoles("Admin", "Client"),
  questionnaireController.submitResponse
);

router.post(
  "/payments",
  authenticateJWT,
  authorizeRoles("Admin", "Client"),
  paymentController.createPayment
);

module.exports = router;
