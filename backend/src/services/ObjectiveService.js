import { getModels } from "../index.js";
import { Op } from "sequelize";

export class ObjectiveService {
  constructor(body = {}) {
    this.body = body;
  }

  async getObjectivesByGoalId(goalId) {
    const { Objective } = getModels();
    try {
      return await Objective.findAll({ where: { goalId } });
    } catch (error) {
      return error;
    }
  }

  async createObjective() {
    const { Objective } = getModels();
    try {
      const newObjective = await Objective.create(this.body);
      return newObjective;
    } catch (error) {
      return error;
    }
  }

  async updateObjective(id) {
    const { Objective } = getModels();
    try {
      const updated = await Objective.update(this.body, { where: { id } });
      return updated[0] === 1
        ? "Objetivo actualizado correctamente."
        : new Error("No se encontró el objetivo.");
    } catch (error) {
      return error;
    }
  }

  async deleteObjective(id) {
    const { Objective } = getModels();
    try {
      const deleted = await Objective.destroy({ where: { id } });
      return deleted === 1
        ? "Objetivo eliminado correctamente."
        : new Error("No se encontró el objetivo.");
    } catch (error) {
      return error;
    }
  }

  async toggleObjectiveState(id, newState) {
    const { Objective, Goal } = getModels();
    try {
      const validStates = ["pending", "inprogress", "completed"];
      if (!validStates.includes(newState)) {
        throw new Error(
          "Estado inválido. Debe ser 'pending', 'inprogress' o 'completed'."
        );
      }

      const objective = await Objective.findOne({ where: { id } });
      if (!objective) throw new Error("Objetivo no encontrado.");

      const updateData = { state: newState };

      if (newState === "completed") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      if (newState !== "inprogress") {
        updateData.agendaListOrder = null;
      }

      if (newState === "inprogress") {
        const maxOrder = await Objective.max("agendaListOrder", {
          where: { state: "inprogress" },
        });

        updateData.agendaListOrder = (maxOrder || 0) + 1;
      }

      const updated = await Objective.update(updateData, { where: { id } });

      if (updated[0] !== 1)
        throw new Error("No se pudo actualizar el objetivo.");

      if (newState === "completed") {
        const remainingObjectives = await Objective.findAll({
          where: { goalId: objective.goalId, state: { [Op.not]: "completed" } },
        });

        if (remainingObjectives.length === 0) {
          await Goal.update(
            { state: "completed" },
            { where: { id: objective.goalId } }
          );
        }
      }
      await this.reorderAgendaListForUser(objective.userId);

      return `Estado del objetivo actualizado a '${newState}'.`;
    } catch (error) {
      return error;
    }
  }

  async reorderAgendaListForUser(userId) {
    const { Objective } = getModels();

    try {
      const objectives = await Objective.findAll({
        where: { userId, state: "inprogress" },
        order: [
          ["agendaListOrder", "ASC"],
          ["createdAt", "ASC"],
        ],
      });

      for (let i = 0; i < objectives.length; i++) {
        await objectives[i].update({ agendaListOrder: i + 1 });
      }
    } catch (error) {
      console.error("Error al reordenar agenda:", error);
    }
  }

  async getObjectivesByState(userId, state) {
    const { Objective } = getModels();
    try {
      return await Objective.findAll({
        where: { userId, state },
      });
    } catch (error) {
      return error;
    }
  }

  async getCompletedObjectivesByMonth(userId) {
    const { Objective } = getModels();
    try {
      const now = new Date();
      const sevenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

      const objectives = await Objective.findAll({
        where: {
          userId,
          completedAt: {
            [Op.ne]: null,
            [Op.gte]: sevenMonthsAgo,
          },
        },
        attributes: ["completedAt"],
      });

      const counts = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        counts[monthYear] = 0;
      }

      objectives.forEach((obj) => {
        const date = new Date(obj.completedAt);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        if (counts[monthYear] !== undefined) {
          counts[monthYear]++;
        }
      });

      return counts;
    } catch (error) {
      console.error("Error obteniendo objetivos completados:", error);
      return error;
    }
  }

  async getGeneralObjectiveCompletion(userId) {
    const { Objective } = getModels();
    try {
      const completed = await Objective.count({
        where: { userId, state: "completed" },
      });

      const notCompleted = await Objective.count({
        where: { userId, state: { [Op.not]: "completed" } },
      });

      return { completed, notCompleted };
    } catch (error) {
      return error;
    }
  }
}
