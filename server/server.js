require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./utils/db");
const models = require("./models/index");
const server = express();
const morgan = require("morgan");

const corsOptions = {
  origin: [
    // "http://192.168.0.241:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "*",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

server.use(cors(corsOptions));
server.use(express.json()); // body parser
server.use(cookieParser());
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true }));
server.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Import routes
const userRoutes = require("./routes/userRoutes");
// const clientRoutes = require("./routes/clientRoutes");
const roleroutes = require("./routes/roleRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const questionnaireResponseRoutes = require("./routes/questionnaireResponseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userAssessmentRoutes = require("./routes/userAssessments");

server.use("api/v1/roles", roleroutes);
server.use("/api/v1/user", userRoutes);
// server.use("/api/v1/user", userRoutes);
// server.use("/api/v1/client", clientRoutes);
server.use("/api/v1/appointment", appointmentRoutes);
server.use("/api/v1/questionnaire", questionnaireRoutes);
server.use("/api/v1/questionnaire-response", questionnaireResponseRoutes);
server.use("/api/v1/payment", paymentRoutes);
server.use("/api/v1/user-assessment", userAssessmentRoutes);

// Sync database and start server

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "Database connection failed, but starting server anyway:",
      error
    );

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT} (without database)`);
    });
  });
