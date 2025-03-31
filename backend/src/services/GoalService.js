import { getModels } from "../index.js";

export class GoalService {
  constructor(body = {}) {
    this.body = body;
  }
  async createGoal() {
    const { Goal } = await getModels();
    try {
      const newGoal = await Goal.create(this.body);
      return newGoal;
    } catch (error) {
      return error;
    }
  }

  async deleteGoal() {
    const { id } = this.body;
    const { Goal } = await getModels();
    try {
      const deleted = await Goal.destroy({ where: { id } });
      return deleted
        ? "Meta eliminada correctamente."
        : new Error("La meta no existe.");
    } catch (error) {
      return error;
    }
  }

  async modifyGoal() {
    const { id, ...updates } = this.body;
    const { Goal } = await getModels();

    try {
      const updated = await Goal.update(updates, { where: { id } });
      return updated[0]
        ? "Meta actualizada correctamente."
        : new Error("No se encontró la meta.");
    } catch (error) {
      return error;
    }
  }

  async toggleGoalState() {
    const { id } = this.body;
    const { Goal } = await getModels();

    try {
      const goal = await Goal.findByPk(id);
      if (!goal) return new Error("Meta no encontrada.");

      const newState =
        goal.state === "pending"
          ? "inprogress"
          : goal.state === "inprogress"
          ? "completed"
          : "pending";

      await goal.update({ state: newState });

      return `Estado de la meta cambiado a: ${newState}`;
    } catch (error) {
      return error;
    }
  }

  async getUserGoals() {
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

      return goals;
    } catch (error) {
      console.error("Error fetching goals: ", error);
      return error;
    }
  }

  async getGoalsWithCompletionData(userId) {
    const { Goal, Objective } = await getModels();

    try {
      const goals = await Goal.findAll({
        where: { userId },
        include: [
          {
            model: Objective,
            as: "goalObjectives",
            required: false,
          },
        ],
      });

      return goals
        .filter((goal) => goal.goalObjectives.length > 0)
        .map((goal) => {
          const completed = goal.goalObjectives.filter(
            (obj) => obj.state === "completed"
          ).length;
          const notCompleted = goal.goalObjectives.filter(
            (obj) => obj.state !== "completed"
          ).length;

          return {
            id: goal.id,
            title: goal.title,
            completed,
            notCompleted,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Error obteniendo datos de metas:", error);
      return [];
    }
  }

  async getSortedGoals(userId, sortBy = "title", order = "ASC") {
    const { Goal, Objective } = await getModels();

    try {
      const goals = await Goal.findAll({
        where: { userId },
        include: [
          {
            model: Objective,
            as: "goalObjectives",
            required: false,
          },
        ],
        order: [[sortBy, order.toUpperCase()]],
      });

      return goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        createdAt: goal.createdAt,
        goalObjectives: goal.goalObjectives
          .map((obj) => ({
            id: obj.id,
            title: obj.title,
            state: obj.state,
            createdAt: obj.createdAt,
            completedAt: obj.completedAt,
            goalListOrder: obj.goalListOrder,
          }))
          .sort((a, b) => a.goalListOrder - b.goalListOrder),
      }));
    } catch (error) {
      console.error("Error obteniendo metas ordenadas:", error);
      return [];
    }
  }

  async createGoal() {
    const { Goal, Objective } = await getModels();

    try {
      const newGoal = await Goal.create({
        title: this.body.title,
        description: this.body.description,
        userId: this.body.userId,
        state: "pending",
      });

      if (!this.body.objectives || this.body.objectives.length === 0) {
        await Objective.create({
          title: newGoal.title,
          description: newGoal.description,
          goalId: newGoal.id,
          userId: newGoal.userId,
          goalListOrder: 1,
          state: "pending",
        });
      } else {
        const objetivos = this.body.objectives
          .filter((obj) => obj.title?.trim())
          .map((obj, index) => ({
            title: obj.title,
            description: obj.description || "",
            goalId: newGoal.id,
            userId: newGoal.userId,
            goalListOrder: index + 1,
            state: "pending",
          }));

        if (objetivos.length > 0) {
          await Objective.bulkCreate(objetivos);
        } else {
          await Objective.create({
            title: newGoal.title,
            description: newGoal.description,
            goalId: newGoal.id,
            userId: newGoal.userId,
            goalListOrder: 1,
            state: "pending",
          });
        }
      }

      return newGoal;
    } catch (error) {
      console.error("Error al crear la meta:", error);
      throw new Error("No se pudo crear la meta. Inténtalo de nuevo.");
    }
  }
}
