import Objective from "../models/Objective.js";
import config from "../config.js";

export class ObjectiveService {
  constructor() {
    this.sequelize = config.postgres.client;
  }
}
