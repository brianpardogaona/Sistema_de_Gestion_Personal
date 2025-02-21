// models/index.js

import { v4 as uuidv4 } from "uuid";
import UserModel from "./User.js";
import GoalModel from "./Goal.js";
import ObjectiveModel from "./Objective.js";

export default async function createTables(sequelize) {
  try {
    // Initialize models
    const User = UserModel(sequelize);
    const Goal = GoalModel(sequelize);
    const Objective = ObjectiveModel(sequelize);

    // Relations between models
    Goal.hasMany(Objective, { foreignKey: "goalId", as: "goalObjectives" });
    Objective.belongsTo(Goal, { foreignKey: "goalId", as: "goal" });

    User.hasMany(Goal, { foreignKey: "userId", as: "userGoals" });
    Goal.belongsTo(User, { foreignKey: "userId", as: "user" });

    User.hasMany(Objective, { foreignKey: "userId", as: "userObjectives" });
    Objective.belongsTo(User, { foreignKey: "userId", as: "user" });


    // BD Sync
    // await sequelize.sync({ alter: true });
    console.log("✅ All tables were successfully synchronized.");

    return { User, Goal, Objective };  
  } catch (error) {
    console.error("❌ Error synchronizing the database:", error);
    throw error; 
  }
}
