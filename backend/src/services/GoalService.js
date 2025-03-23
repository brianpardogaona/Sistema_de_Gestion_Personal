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
            required: true,
          },
        ],
        order: [['title', 'ASC']],
      });
  
      const goalCompletionData = goals.map((goal) => {
        const completed = goal.goalObjectives.filter(obj => obj.state === "completed").length;
        const notCompleted = goal.goalObjectives.filter(obj => obj.state !== "completed").length;
  
        return {
          id: goal.id,
          title: goal.title,
          completed,
          notCompleted,
        };
      });
  
      return goalCompletionData;
    } catch (error) {
      console.error("Error obteniendo datos de completion:", error);
      return error;
    }
  }
  
  
}
