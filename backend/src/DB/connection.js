import { Sequelize } from 'sequelize';
import config from '../config.js';

async function connectToPostgres() {
  const sequelize = new Sequelize(config.postgres.options);

  try {
    await sequelize.authenticate();
    console.log("Connection with DB has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelize;
}

export default connectToPostgres;
