const { UserAssessment, User } = require("../models");

const userAssessmentController = {
  // Create assessment with user data
  createUserWithAssessment: async (req, res) => {
    try {
      const { user, assessment } = req.body;

      // Validate required fields
      if (!user || !user.email || !user.firstName || !user.lastName) {
        return res.status(400).json({
          error: "Missing required fields: email, firstName, lastName",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: user.email },
      });

      let userId;

      if (existingUser) {
        // Use existing user
        userId = existingUser.id;

        // Update user information if provided
        if (user.phone || user.address || user.message) {
          await existingUser.update({
            phone: user.phone || existingUser.phone,
            address: user.address || existingUser.address,
            message: user.message || existingUser.message,
          });
        }
      } else {
        // Create new user
        const newUser = await User.create({
          username: user.username,
          email: user.email,
          password: user.password || "defaultPassword123",
          roleId: user.roleId || 4,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          message: user.message,
        });
        userId = newUser.id;
      }

      // Create assessment
      const userAssessment = await UserAssessment.create({
        userId,
        // Step 1
        problem: assessment.problem,
        problemOther: assessment["problem-other"],
        duration: assessment.duration,
        durationOther: assessment["duration-other"],
        triggersAssessment: assessment["triggers-assessment"],
        triggersAssessmentOther: assessment["triggers-assessment-other"],
        medications: assessment.medications,
        medicationsOther: assessment["medications-other"],

        // Step 2
        distressIntensifiers: assessment["distress-intensifiers"],
        distressIntensifiersOther: assessment["distress-intensifiers-other"],
        physicalSensations: assessment["physical-sensations"],
        physicalSensationsOther: assessment["physical-sensations-other"],
        negativeThoughts: assessment["negative-thoughts"],
        negativeThoughtsOther: assessment["negative-thoughts-other"],

        // Step 3
        resolution: assessment.resolution,
        resolutionOther: assessment["resolution-other"],
        timeline: assessment.timeline,
        timelineOther: assessment["timeline-other"],
        confidence: assessment.confidence,

        // Step 4
        happyMemories: assessment["happy-memories"],
        relaxationAids: assessment["relaxation-aids"],
        relaxationAidsOther: assessment["relaxation-aids-other"],
        supportSystem: assessment["support-system"],
        supportSystemOther: assessment["support-system-other"],
        rechargeActivities: assessment["recharge-activities"],
        rechargeActivitiesOther: assessment["recharge-activities-other"],

        // Step 5
        package: assessment.package,

        // Step 6
        location: assessment.location,

        // Step 8
        cardName: assessment["card-name"],
        cardNumber: assessment["card-number"],
        cardExpiry: assessment["card-expiry"],
        cardCvc: assessment["card-cvc"],
      });

      const result = await UserAssessment.findByPk(userAssessment.id, {
        include: [
          {
            model: User,
            as: "AssessmentUser",
            attributes: ["id", "firstName", "lastName", "email", "phone"],
          },
        ],
      });

      res.status(201).json({
        message: "User assessment created successfully",
        assessment: result,
      });
    } catch (error) {
      console.error("Error creating user assessment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Add additional data to existing user
  addAdditionalData: async (req, res) => {
    try {
      const { userId } = req.params;
      const { formData } = req.body;

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if assessment already exists for this user
      let assessment = await UserAssessment.findOne({ where: { userId } });

      if (assessment) {
        // Update existing assessment
        await assessment.update({
          // Step 1
          problem: formData.problem || assessment.problem,
          problemOther: formData["problem-other"] || assessment.problemOther,
          duration: formData.duration || assessment.duration,
          durationOther: formData["duration-other"] || assessment.durationOther,
          triggersAssessment:
            formData["triggers-assessment"] || assessment.triggersAssessment,
          triggersAssessmentOther:
            formData["triggers-assessment-other"] ||
            assessment.triggersAssessmentOther,
          medications: formData.medications || assessment.medications,
          medicationsOther:
            formData["medications-other"] || assessment.medicationsOther,

          // Step 2
          distressIntensifiers:
            formData["distress-intensifiers"] ||
            assessment.distressIntensifiers,
          distressIntensifiersOther:
            formData["distress-intensifiers-other"] ||
            assessment.distressIntensifiersOther,
          physicalSensations:
            formData["physical-sensations"] || assessment.physicalSensations,
          physicalSensationsOther:
            formData["physical-sensations-other"] ||
            assessment.physicalSensationsOther,
          negativeThoughts:
            formData["negative-thoughts"] || assessment.negativeThoughts,
          negativeThoughtsOther:
            formData["negative-thoughts-other"] ||
            assessment.negativeThoughtsOther,

          // Step 3
          resolution: formData.resolution || assessment.resolution,
          resolutionOther:
            formData["resolution-other"] || assessment.resolutionOther,
          timeline: formData.timeline || assessment.timeline,
          timelineOther: formData["timeline-other"] || assessment.timelineOther,
          confidence: formData.confidence || assessment.confidence,

          // Step 4
          happyMemories: formData["happy-memories"] || assessment.happyMemories,
          relaxationAids:
            formData["relaxation-aids"] || assessment.relaxationAids,
          relaxationAidsOther:
            formData["relaxation-aids-other"] || assessment.relaxationAidsOther,
          supportSystem: formData["support-system"] || assessment.supportSystem,
          supportSystemOther:
            formData["support-system-other"] || assessment.supportSystemOther,
          rechargeActivities:
            formData["recharge-activities"] || assessment.rechargeActivities,
          rechargeActivitiesOther:
            formData["recharge-activities-other"] ||
            assessment.rechargeActivitiesOther,

          // Step 5
          package: formData.package || assessment.package,

          // Step 6
          location: formData.location || assessment.location,

          // Step 8
          cardName: formData["card-name"] || assessment.cardName,
          cardNumber: formData["card-number"] || assessment.cardNumber,
          cardExpiry: formData["card-expiry"] || assessment.cardExpiry,
          cardCvc: formData["card-cvc"] || assessment.cardCvc,
        });
      } else {
        // Create new assessment
        assessment = await UserAssessment.create({
          userId,
          // Step 1
          problem: formData.problem,
          problemOther: formData["problem-other"],
          duration: formData.duration,
          durationOther: formData["duration-other"],
          triggersAssessment: formData["triggers-assessment"],
          triggersAssessmentOther: formData["triggers-assessment-other"],
          medications: formData.medications,
          medicationsOther: formData["medications-other"],

          // Step 2
          distressIntensifiers: formData["distress-intensifiers"],
          distressIntensifiersOther: formData["distress-intensifiers-other"],
          physicalSensations: formData["physical-sensations"],
          physicalSensationsOther: formData["physical-sensations-other"],
          negativeThoughts: formData["negative-thoughts"],
          negativeThoughtsOther: formData["negative-thoughts-other"],

          // Step 3
          resolution: formData.resolution,
          resolutionOther: formData["resolution-other"],
          timeline: formData.timeline,
          timelineOther: formData["timeline-other"],
          confidence: formData.confidence,

          // Step 4
          happyMemories: formData["happy-memories"],
          relaxationAids: formData["relaxation-aids"],
          relaxationAidsOther: formData["relaxation-aids-other"],
          supportSystem: formData["support-system"],
          supportSystemOther: formData["support-system-other"],
          rechargeActivities: formData["recharge-activities"],
          rechargeActivitiesOther: formData["recharge-activities-other"],

          // Step 5
          package: formData.package,

          // Step 6
          location: formData.location,

          // Step 8
          cardName: formData["card-name"],
          cardNumber: formData["card-number"],
          cardExpiry: formData["card-expiry"],
          cardCvc: formData["card-cvc"],
        });
      }

      const updatedAssessment = await UserAssessment.findByPk(assessment.id, {
        include: [
          {
            model: User,
            as: "AssessmentUser",
            attributes: ["id", "firstName", "lastName", "email", "phone"],
          },
        ],
      });

      res.json({
        message: "Additional data added successfully",
        assessment: updatedAssessment,
      });
    } catch (error) {
      console.error("Error adding additional data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get assessment by user ID
  getAssessmentByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const assessment = await UserAssessment.findOne({
        where: { userId },
        include: [
          {
            model: User,
            as: "AssessmentUser",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "address",
              "message",
            ],
          },
        ],
      });

      if (!assessment) {
        return res
          .status(404)
          .json({ error: "Assessment not found for this user" });
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all assessments
  getAllAssessments: async (req, res) => {
    try {
      const assessments = await UserAssessment.findAll({
        include: [
          {
            model: User,
            as: "AssessmentUser",
            attributes: ["id", "firstName", "lastName", "email", "phone"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userAssessmentController;
