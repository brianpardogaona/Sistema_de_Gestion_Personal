import { getModels } from "../index.js";

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
}
