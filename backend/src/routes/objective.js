import express from "express";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { ObjectiveService } from "../services/ObjectiveService.js";

const router = express.Router();

// Create objective
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService({
      userId: req.user.id,
      ...req.body,
    });
    const result = await objectiveService.createObjective();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get completed objectives per month
router.get("/completed-per-month", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    const result = await objectiveService.getCompletedObjectivesByMonth(
      req.user.id
    );

    if (result instanceof Error) {
      res.status(500).json({ error: result.message });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Delete objective
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    await objectiveService.deleteObjective(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modify objective
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService({
      userId: req.user.id,
      ...req.body,
    });
    const updatedObjective = await objectiveService.updateObjective(
      req.params.id
    );
    res.status(200).json(updatedObjective);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle objective state
router.patch("/:id/toggle", authenticateToken, async (req, res) => {
  try {
    const { state } = req.body;
    const objectiveService = new ObjectiveService();
    const result = await objectiveService.toggleObjectiveState(
      req.params.id,
      state
    );

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
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    const objectives = await objectiveService.getObjectivesByUserId(
      req.user.id
    );
    res.status(200).json(objectives);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user objectives filtered by state
router.get("/user/state/:state", authenticateToken, async (req, res) => {
  try {
    const { state } = req.params;
    const validStates = ["pending", "inprogress", "completed"];

    if (!validStates.includes(state)) {
      return res.status(400).json({
        error:
          "Estado inválido. Debe ser 'pending', 'inprogress' o 'completed'.",
      });
    }

    const objectiveService = new ObjectiveService();
    const objectives = await objectiveService.getObjectivesByState(
      req.user.id,
      state
    );

    res.status(200).json(objectives);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Get general compliance state of objectives
router.get("/general-completion", authenticateToken, async (req, res) => {
  try {
    const objectiveService = new ObjectiveService();
    const result = await objectiveService.getGeneralObjectiveCompletion(
      req.user.id
    );

    if (result instanceof Error) {
      res.status(500).json({ error: result.message });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Upadate Agenda Order
router.patch(
  "/user/update-agenda-order",
  authenticateToken,
  async (req, res) => {
    try {
      const { order } = req.body;

      if (!Array.isArray(order) || order.length === 0) {
        return res
          .status(400)
          .json({ error: "El orden debe ser un array no vacío de IDs." });
      }

      const objectiveService = new ObjectiveService();
      const result = await objectiveService.updateAgendaOrder(
        order,
        req.user.id
      );

      if (result instanceof Error) {
        return res.status(400).json({ error: result.message });
      }

      res
        .status(200)
        .json({ message: "Orden de la agenda actualizado correctamente." });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

export default router;
