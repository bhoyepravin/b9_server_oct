const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnaireController");

router.get("/", questionnaireController.getAllQuestionnaires);
router.get("/:id", questionnaireController.getQuestionnaireById);
router.post("/create", questionnaireController.createQuestionnaire);
router.put("/:id", questionnaireController.updateQuestionnaire);
router.delete("/:id", questionnaireController.deleteQuestionnaire);
router.get("/user/:userId", questionnaireController.getQuestionnairesByCreator);

module.exports = router;
