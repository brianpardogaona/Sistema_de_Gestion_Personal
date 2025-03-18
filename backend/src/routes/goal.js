import express from "express";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { GoalService } from "../services/GoalService.js";

const router = express.Router();

// Create goal
router.post("/create", authenticateToken, async (req, res) => {
  const goalService = new GoalService({ userId: req.user.id, ...req.body });
  const result = await goalService.createGoal();

  if (!(result instanceof Error)) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Delete goal
router.delete("/:id", authenticateToken, async (req, res) => {
  const goalService = new GoalService({
    id: req.params.id,
    userId: req.user.id,
  });
  const result = await goalService.deleteGoal();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Modify goal
router.patch("/:id", authenticateToken, async (req, res) => {
  const goalService = new GoalService({
    id: req.params.id,
    userId: req.user.id,
    ...req.body,
  });
  const result = await goalService.modifyGoal();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Toggle goal state
router.patch("/:id/toggle", authenticateToken, async (req, res) => {
  const goalService = new GoalService({
    id: req.params.id,
    userId: req.user.id,
  });
  const result = await goalService.toggleGoalState();

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

// Get user goals
router.get("/user", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const goalService = new GoalService(req.user);
    const goals = await goalService.getUserGoals();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
