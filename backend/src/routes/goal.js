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

// Get goal by ID with all its objectives
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const goalService = new GoalService();
    const goal = await goalService.getGoalById(req.params.id, req.user.id);

    if (!goal) {
      return res.status(404).json({ error: "Meta no encontrada" });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error("Error al obtener la meta:", error);
    res.status(500).json({ error: error.message });
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

// Goals and objective stats
router.get("/user/goals-completion", authenticateToken, async (req, res) => {
  try {
    const goalService = new GoalService();
    const goalData = await goalService.getGoalsWithCompletionData(req.user.id);

    res.status(200).json(goalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user goals with sorting
router.get("/user/sorted-goals", authenticateToken, async (req, res) => {
  try {
    const { sortBy = "title", order = "ASC" } = req.query;

    const goalService = new GoalService();
    const goals = await goalService.getSortedGoals(req.user.id, sortBy, order);

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/objective/create-multiple",
  authenticateToken,
  async (req, res) => {
    try {
      const { Objective } = await getModels();
      const objetivos = req.body.map((obj) => ({
        ...obj,
        userId: req.user.id,
        state: "pending",
      }));

      await Objective.bulkCreate(objetivos);
      res.status(201).json({ message: "Objetivos creados correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all user goals with their objectives
router.get(
  "/user/goals-with-objectives",
  authenticateToken,
  async (req, res) => {
    try {
      const goalService = new GoalService();
      const goalsWithObjectives = await goalService.getGoalsWithObjectives(
        req.user.id
      );

      res.status(200).json(goalsWithObjectives);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Modify Goal and Objectives
router.patch("/:id/update", authenticateToken, async (req, res) => {
  const goalService = new GoalService(req.body);

  const result = await goalService.modifyGoalWithObjectives(
    req.user.id,
    req.params.id
  );

  if (!(result instanceof Error)) {
    res.json({ message: result });
  } else {
    res.status(400).json({ error: result.message });
  }
});

export default router;
