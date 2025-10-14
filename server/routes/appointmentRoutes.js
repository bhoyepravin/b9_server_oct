const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.post("/create", appointmentController.createAppointment);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);
router.get("/user/:userId", appointmentController.getAppointmentsByUserId);
router.get(
  "/therapist/:therapistId",
  appointmentController.getAppointmentsByTherapistId
);

module.exports = router;
