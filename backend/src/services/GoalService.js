import Goal from "../models/Goal.js";
import config from "../config.js";

export class GoalService {
  constructor(body = {}) {
    this.sequelize = config.postgres.client;
    this.body = body;
  }

  async createGoal() {
    const goalModel = Goal(this.sequelize);
    try {
      const newGoal = await goalModel.create(this.body);
      return newGoal;
    } catch (error) {
      return error;
    }
  }

  async deleteGoal() {
    const goalModel = Goal(this.sequelize);
    const { id } = this.body;
    
    try {
      const deleted = await goalModel.destroy({ where: { id } });
      return deleted ? "Meta eliminada correctamente." : new Error("La meta no existe.");
    } catch (error) {
      return error;
    }
  }

  async modifyGoal() {
    const goalModel = Goal(this.sequelize);
    const { id, ...updates } = this.body;

    try {
      const updated = await goalModel.update(updates, { where: { id } });
      return updated[0] ? "Meta actualizada correctamente." : new Error("No se encontró la meta.");
    } catch (error) {
      return error;
    }
  }

  async toggleGoalState() {
    const goalModel = Goal(this.sequelize);
    const { id } = this.body;

    try {
      const goal = await goalModel.findByPk(id);
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
    const goalModel = Goal(this.sequelize);
    const objectiveModel = Objective(this.sequelize);

    try {
      const goals = await goalModel.findAll({
        where: { userId: this.body.userId },
        include: [
          {
            model: objectiveModel,
            as: "objectives",
          },
        ],
      });

      return goals.length ? goals : new Error("No se encontraron metas para este usuario.");
    } catch (error) {
      return error;
    }
  }
}
