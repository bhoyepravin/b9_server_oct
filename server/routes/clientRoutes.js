const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// GET /api/clients - Get all clients
router.get("/", clientController.getAllClients);

// GET /api/clients/search - Search clients by name
router.get("/search", clientController.searchClients);

// GET /api/clients/:id - Get client by ID
router.get("/:id", clientController.getClientById);

// GET /api/clients/email/:email - Get client by email
router.get("/email/:email", clientController.getClientByEmail);

// POST /api/clients - Create new client
router.post("/create", clientController.createClient);

// PUT /api/clients/:id - Update client
router.put("/:id", clientController.updateClient);

// DELETE /api/clients/:id - Delete client
router.delete("/:id", clientController.deleteClient);

module.exports = router;
