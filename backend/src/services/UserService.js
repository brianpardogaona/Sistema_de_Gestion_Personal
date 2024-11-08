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

  async getUser(){
    const userId = this.body.id;
    const user = User(this.sequelize);

    try {
      const foundUser = await user.findAll({
        where: {
          id: userId
        }
      });
  
      return foundUser[0].dataValues;
    } catch (error) {
        return error;
    }

    
  }

  
}
