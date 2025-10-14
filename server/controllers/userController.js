const { User, Role } = require("../models");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            as: "UserRole",
            attributes: ["id", "name", "description"],
          },
        ],
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Role,
            as: "UserRole",
            attributes: ["id", "name", "description"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const { username, email, password, roleId, firstName, lastName, phone } =
        req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const user = await User.create({
        username,
        email,
        password, // In production, hash this password
        roleId,
        firstName,
        lastName,
        phone,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, roleId, firstName, lastName, phone, isActive } =
        req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update({
        username,
        email,
        roleId,
        firstName,
        lastName,
        phone,
        isActive,
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
