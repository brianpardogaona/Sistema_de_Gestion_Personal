import Goal from "../models/Goal.js";
import config from "../config.js";

export class GoalService {
  constructor() {
    this.sequelize = config.postgres.client;
  }
}
