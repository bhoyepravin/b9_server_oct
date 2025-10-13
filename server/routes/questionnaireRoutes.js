const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnaireController");

router.get("/", questionnaireController.getAllQuestionnaires);
//router.get("/search", questionnaireController.searchQuestionnaires);
router.get("/user/:userId", questionnaireController.getQuestionnairesByUser);
router.get("/:id", questionnaireController.getQuestionnaireById);
router.post("/create", questionnaireController.createQuestionnaire);
//router.post("/validate", questionnaireController.validateQuestionnaire);
//router.put("/:id", questionnaireController.updateQuestionnaire);
//router.delete("/:id", questionnaireController.deleteQuestionnaire);

module.exports = router;
