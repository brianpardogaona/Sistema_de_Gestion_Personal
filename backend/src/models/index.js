import { v4 as uuidv4 } from "uuid";

import UserModel from "./User.js";
import GoalModel from "./Goal.js";
import ObjectiveModel from "./Objective.js";

export default async function createTables(sequelize) {
  try {
    // Initialize models without relations
    const User = UserModel(sequelize);
    const Goal = GoalModel(sequelize);
    const Objective = ObjectiveModel(sequelize);

    // Relations
    Goal.hasMany(Objective, { foreignKey: "goalId", as: "objectives" });
    Objective.belongsTo(Goal, { foreignKey: "goalId", as: "goal" });

    // DB Sync
    // await sequelize.sync({ alter: true });
    console.log("✅ All tables were succesfully synchronized.");

  } catch (error) {
    console.error("❌ Error synchronizing the database: ", error);
  }
}
