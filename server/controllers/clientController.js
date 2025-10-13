const { Client } = require("../models");
const { Op } = require("sequelize");

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [["createdAt", "DESC"]], // Latest first
    });

    res.status(200).json({
      success: true,
      data: clients,
      count: clients.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message,
    });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client",
      error: error.message,
    });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields",
      });
    }

    // Check if client with email already exists
    const existingClient = await Client.findOne({
      where: { email },
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    const client = await Client.create({
      name,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating client",
      error: error.message,
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if email is already taken by another client
    if (email && email !== client.email) {
      const existingClient = await Client.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Email already taken by another client",
        });
      }
    }

    await client.update({
      ...(name && { name }),
      ...(email && { email }),
    });

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating client",
      error: error.message,
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await client.destroy();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message,
    });
  }
};

// Get client by email
exports.getClientByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const client = await Client.findOne({
      where: { email },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client by email",
      error: error.message,
    });
  }
};

// Search clients by name
exports.searchClients = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name query parameter is required",
      });
    }

    const clients = await Client.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`, // Case-insensitive search
        },
      },
    });

    res.status(200).json({
      success: true,
      data: clients,
      count: clients.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching clients",
      error: error.message,
    });
  }
};
