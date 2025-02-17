import express from "express";

// services
import { ObjectiveService } from "../services/ObjectiveService.js";

const router = express.Router();

// Create objective
router.post("/create", async (req, res) => {
  try {
    const objective = await ObjectiveService.createObjective(req.body);
    res.status(201).json(objective);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete objective
router.delete("/:id", async (req, res) => {
  try {
    await ObjectiveService.deleteObjective(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modify objective
router.put("/:id", async (req, res) => {
  try {
    const updatedObjective = await ObjectiveService.updateObjective(req.params.id, req.body);
    res.status(200).json(updatedObjective);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle objective state
router.patch("/:id/toggle", async (req, res) => {
  try {
    const toggledObjective = await ObjectiveService.toggleObjectiveState(req.params.id);
    res.status(200).json(toggledObjective);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user objectives
router.get("/user/:userId", async (req, res) => {
  try {
    const objectives = await ObjectiveService.getUserObjectives(req.params.userId);
    res.status(200).json(objectives);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
