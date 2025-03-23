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

      const updateData = { state: newState };

      if (newState === "completed") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      const updated = await Objective.update(updateData, { where: { id } });

      if (updated[0] !== 1) {
        throw new Error("No se encontró el objetivo.");
      }

      const objective = await Objective.findOne({ where: { id } });

      if (!objective) {
        throw new Error(
          "No se encontró el objetivo después de la actualización."
        );
      }

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

      return `Estado del objetivo actualizado a '${newState}'.`;
    } catch (error) {
      return error;
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

  async getCompletedObjectivesByMonth() {
    const { Objective } = getModels();
    try {
      const now = new Date();
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(now.getMonth() - 6);

      const objectives = await Objective.findAll({
        where: {
          completedAt: {
            [Op.ne]: null,
            [Op.gte]: sevenMonthsAgo,
          },
        },
        attributes: ["completedAt"],
      });

      const counts = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        counts[monthYear] = 0;
      }

      objectives.forEach((obj) => {
        const date = new Date(obj.completedAt);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (counts[monthYear] !== undefined) {
          counts[monthYear]++;
        }
      });

      console.log(counts);

      return counts;
    } catch (error) {
      return error;
    }
  }

  async getGoalsWithObjectiveStats() {
    try {
      const { Goal, Objective } = await getModels();
      const goals = await Goal.findAll({
        where: { userId: this.body.id },
        include: [
          {
            model: Objective,
            as: "goalObjectives",
            required: false,
          },
        ],
      });

      const result = goals.map((goal) => {
        const totalObjectives = goal.goalObjectives.length;
        const completedObjectives = goal.goalObjectives.filter(
          (obj) => obj.state === "completed"
        ).length;
        const pendingObjectives = totalObjectives - completedObjectives;

        return {
          id: goal.id,
          title: goal.title,
          completed: completedObjectives,
          pending: pendingObjectives,
        };
      });

      return result;
    } catch (error) {
      console.error("Error fetching goal statistics: ", error);
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
