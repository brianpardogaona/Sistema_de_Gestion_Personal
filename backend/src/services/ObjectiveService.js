import { getModels } from "../index.js";
import {Op} from "sequelize";

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
        throw new Error("Estado inválido. Debe ser 'pending', 'inprogress' o 'completed'.");
      }
  
      // Actualizar el estado del objetivo
      const updated = await Objective.update({ state: newState }, { where: { id } });
  
      if (updated[0] !== 1) {
        throw new Error("No se encontró el objetivo.");
      }
  
      // Obtener el objetivo actualizado
      const objective = await Objective.findOne({ where: { id } });
  
      if (!objective) {
        throw new Error("No se encontró el objetivo después de la actualización.");
      }
  
      // Si el objetivo es parte de una meta, verificar si todos los objetivos de la meta están completados
      if (newState === "completed") {
        const remainingObjectives = await Objective.findAll({
          where: { goalId: objective.goalId, state: { [Op.not]: "completed" } },
        });
  
        // Si no hay objetivos pendientes o en progreso, marcar la meta como completada
        if (remainingObjectives.length === 0) {
          await Goal.update({ state: "completed" }, { where: { id: objective.goalId } });
        }
      }
  
      return `Estado del objetivo actualizado a '${newState}'.`;
    } catch (error) {
      return error;
    }
  }
  
}
