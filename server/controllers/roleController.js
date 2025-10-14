const { Role, User } = require("../models");

const roleController = {
  // Get all roles
  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.findAll({
        include: [
          {
            model: User,
            as: "RoleUsers",
            attributes: ["id", "username", "email", "firstName", "lastName"],
          },
        ],
      });
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get role by ID
  getRoleById: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "RoleUsers",
            attributes: ["id", "username", "email", "firstName", "lastName"],
          },
        ],
      });

      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      res.json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new role
  createRole: async (req, res) => {
    try {
      const { name, description, permissions } = req.body;

      // Check if role already exists
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res
          .status(400)
          .json({ error: "Role with this name already exists" });
      }

      const role = await Role.create({
        name,
        description,
        permissions,
      });

      res.status(201).json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update role
  updateRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, permissions } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      await role.update({
        name,
        description,
        permissions,
      });

      res.json(role);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete role
  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      await role.destroy();
      res.json({ message: "Role deleted successfully" });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = roleController;
