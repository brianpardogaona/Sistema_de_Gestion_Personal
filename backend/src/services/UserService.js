import User from "../models/User.js";
import config from "../config.js";

export class UserService {
  constructor(body) {
    this.sequelize = config.postgres.client;
    this.body = body;
  }

  get() {
    return this.body;
  }

  async createUser() {
    const user = User(this.sequelize);

    try {
      await user.create(this.body);
      return true;
    } catch (error) {
      return error;
    }
  }
}
