import express from "express";

// services
import { ObjectiveService } from "../services/ObjectiveService.js";

const router = express.Router();

// Create objective
router.post("/create", async (req, res) => {
  try {
    const objectiveService = new ObjectiveService(req.body);
    const result = await objectiveService.createObjective();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete objective
router.delete("/:id", async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    await objectiveService.deleteObjective(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modify objective
router.put("/:id", async (req, res) => {
  try {
    const objectiveService = new ObjectiveService(req.body);
    const updatedObjective = await objectiveService.updateObjective(req.params.id);
    res.status(200).json(updatedObjective);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle objective state
router.patch("/:id/toggle", async (req, res) => {
  console.log("Test" + req.body.state);
  try {
    const { state } = req.body;
    const objectiveService = new ObjectiveService();
    const result = await objectiveService.toggleObjectiveState(req.params.id, state);

    if (!(result instanceof Error)) {
      res.status(200).json({ message: result });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Get user objectives
router.get("/user/:userId", async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    const objectives = await objectiveService.getObjectivesByGoalId(req.params.userId);
    res.status(200).json(objectives);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




export default router;
