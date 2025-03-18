import { getModels } from "../index.js";
import bcrypt from "bcrypt";
import { Validation } from "./Validation.js";

export class UserService {
  constructor(body) {
    this.body = body;
  }

  async getAllUsers() {
    const { User } = await getModels();
    try {
      const allUsers = await User.findAll();
      return allUsers.map((u) => u.dataValues);
    } catch (error) {
      return error;
    }
  }

  async getUser() {
    const { User } = await getModels();
    const userId = this.body.id;

    try {
      const foundUser = await User.findOne({ where: { id: userId } });
      return foundUser
        ? foundUser.dataValues
        : new Error("Usuario no encontrado.");
    } catch (error) {
      return error;
    }
  }

  async login() {
    const { User } = await getModels();
    const { username, password } = this.body;

    try {
      const userExists = await User.findOne({ where: { username } });
      if (!userExists) throw new Error("El nombre de usuario no existe");

      const isValid = await bcrypt.compare(
        password,
        userExists.dataValues.password
      );
      if (!isValid) throw new Error("La contraseña es incorrecta");

      return userExists;
    } catch (error) {
      return error;
    }
  }

  async createUser() {
    try {
      Validation.username(this.body.username);
      Validation.name(this.body.name);
      Validation.name(this.body.lastName);
      Validation.password(this.body.password);

      this.body.password = await bcrypt.hash(
        this.body.password,
        Number(process.env.SALTS_ROUNDS)
      );

      const { User } = getModels();
      await User.create(this.body);
      return "Usuario creado correctamente.";
    } catch (error) {
      return error;
    }
  }

  async deleteUser() {
    const { User } = await getModels();
    const id = this.body.id;

    try {
      const drop = await User.destroy({ where: { id } });
      return drop === 1
        ? "El usuario ha sido eliminado correctamente"
        : new Error("El usuario no existe");
    } catch (error) {
      return error;
    }
  }

  async modifyUser() {
    const { User } = await getModels();
    const { id, ...updates } = this.body;

    try {
      if (Object.keys(updates).length === 0) {
        throw new Error("No se proporcionaron datos para actualizar.");
      }

      if (updates.username) Validation.username(updates.username);
      if (updates.name) Validation.name(updates.name);
      if (updates.lastName) Validation.name(updates.lastName);
      if (updates.password) {
        Validation.password(updates.password);
        updates.password = await bcrypt.hash(
          updates.password,
          Number(process.env.SALTS_ROUNDS)
        );
      }

      const updated = await User.update(updates, { where: { id } });

      return updated[0] === 1
        ? "Usuario actualizado correctamente."
        : new Error("No se encontró el usuario o no se realizaron cambios.");
    } catch (error) {
      return error;
    }
  }

  async getUserProfile() {
    const { User } = await getModels();
    try {
      const user = await User.findOne({
        where: { id: this.body.id },
        attributes: ["name", "lastName", "username"],
      });

      return user ? user.dataValues : new Error("Usuario no encontrado.");
    } catch (error) {
      return error;
    }
  }
}
