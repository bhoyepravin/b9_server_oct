const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);
router.get("/upcoming", appointmentController.getUpcomingAppointments);
router.get("/range", appointmentController.getAppointmentsByDateRange);
router.get("/client/:clientId", appointmentController.getAppointmentsByClient);
router.get("/:id", appointmentController.getAppointmentById);
router.post("/create", appointmentController.createAppointment);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
