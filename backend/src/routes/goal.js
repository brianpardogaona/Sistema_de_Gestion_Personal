import express from "express";
import { GoalService } from "../services/GoalService.js";

const router = express.Router();

// Create goal
router.post("/create", async (req, res) => {
  const goalService = new GoalService(req.body);
  const result = await goalService.createGoal();

  if (!(result instanceof Error)) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Delete goal
router.delete("/:id", async (req, res) => {
  const goalService = new GoalService({ id: req.params.id });
  const result = await goalService.deleteGoal();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Modify goal
router.patch("/:id", async (req, res) => {
  const goalService = new GoalService({ id: req.params.id, ...req.body });
  const result = await goalService.modifyGoal();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Toggle goal state
router.patch("/:id/toggle", async (req, res) => {
  const goalService = new GoalService({ id: req.params.id });
  const result = await goalService.toggleGoalState();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Get user goals
router.get("/user/:userId", async (req, res) => {
  const goalService = new GoalService({ userId: req.params.userId });
  const result = await goalService.getUserGoals();

  if (!(result instanceof Error)) {
    res.json(result);
  } else {
    res.status(400).json({ error: result.message });
  }
});

export default router;
