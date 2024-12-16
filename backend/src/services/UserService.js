import User from "../models/User.js";
import config from "../config.js";
import bcrypt from "bcrypt";
import { Validation } from "./Validation.js";

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
      Validation.username(this.body.username);
      Validation.name(this.body.name);
      Validation.name(this.body.lastName);
      Validation.password(this.body.password);
    } catch (error) {
      return error;
    }

    this.body.password = await bcrypt.hash(
      this.body.password,
      Number(process.env.SALTS_ROUNDS)
    );

    try {
      await user.create(this.body);
      return "Usuario creado correctamente.";
    } catch (error) {
      return error;
    }
  }

  async deleteUser() {
    const user = User(this.sequelize);
    const id = this.body.id;
    const drop = await user.destroy({
      where: {
        id: id,
      },
    });

    if (drop == 1) {
      return "El usuario ha sido eliminado correctamente";
    } else if (drop == 0) {
      return new Error("El usuario no existe");
    } else {
      return new Error("Algo ha ido mal");
    }
  }

  async modifyUser() {}
}
