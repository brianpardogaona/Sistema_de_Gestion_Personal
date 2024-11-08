import { DataTypes } from "sequelize";
import User from "./User.js";
import { v4 as uuidv4 } from "uuid";

export default async function createTables(sequelize) {
  const user = User(sequelize);
  User(sequelize);
  // sequelize.sync(); // {alter: true}
  console.log("All models were synchronized successfully.");
  
  // Crear un nuevo usuario
  //  const jane = await user.create( {username: 'jane2', name: 'Jane', lastName: 'Doe', password: 123});

  // Buscar por id
  /*const uuid_ex = uuidv4();
  const existing_uuid = "06167e68-4164-4828-9488-95e5294eb935"

  const existing_user =  await user.findAll({
    where: {
      id: existing_uuid,
    },
  });

  console.log(existing_user[0].dataValues)*/
}
