import Objective from "../models/Objective.js";
import config from "../config.js";

export class ObjectiveService {
  constructor(body = {}) {
    this.sequelize = config.postgres.client;
    this.body = body;
  }

  async getObjectivesByGoalId(goalId) {
    const objectiveModel = Objective(this.sequelize);
    try {
      return await objectiveModel.findAll({ where: { goalId } });
    } catch (error) {
      return error;
    }
  }

  async createObjective() {
    const objectiveModel = Objective(this.sequelize);
    try {
      const newObjective = await objectiveModel.create(this.body);
      return newObjective;
    } catch (error) {
      return error;
    }
  }

  async updateObjective(id) {
    const objectiveModel = Objective(this.sequelize);
    try {
      const updated = await objectiveModel.update(this.body, { where: { id } });
      return updated[0] === 1
        ? "Objetivo actualizado correctamente."
        : new Error("No se encontró el objetivo.");
    } catch (error) {
      return error;
    }
  }

  async deleteObjective(id) {
    const objectiveModel = Objective(this.sequelize);
    try {
      const deleted = await objectiveModel.destroy({ where: { id } });
      return deleted === 1
        ? "Objetivo eliminado correctamente."
        : new Error("No se encontró el objetivo.");
    } catch (error) {
      return error;
    }
  }
}
