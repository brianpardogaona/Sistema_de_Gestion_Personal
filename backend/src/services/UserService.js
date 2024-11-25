import User from "../models/User.js";
import config from "../config.js";

export class UserService {
  constructor(body) {
    this.sequelize = config.postgres.client;
    this.body = body;
  }

  async getAllUsers() {
    const user = User(this.sequelize);
    const allUsers = await user.findAll();
    let allUsersData = [];
    allUsers.map((u) => {
      allUsersData.push(u.dataValues);
    });
    return allUsersData;
  }

  async getUser() {
    const userId = this.body.id;
    const user = User(this.sequelize);

    try {
      const foundUser = await user.findAll({
        where: {
          id: userId,
        },
      });

      return foundUser[0].dataValues;
    } catch (error) {
      return error;
    }
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
