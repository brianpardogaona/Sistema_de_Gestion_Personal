import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
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

    if (process.env.SYNC_DB === "force") {
      await sequelize.sync({ force: true });
      const hashedPassword = await bcrypt.hash(
        "12345678",
        Number(process.env.SALTS_ROUNDS) || 10
      );
      await User.create({
        id: uuidv4(),
        username: "brian",
        password: hashedPassword,
        name: "Admin",
        lastName: "Root",
      });
      console.log("✅ Default root user created. DB Restarted");

    } else if (process.env.SYNC_DB === "alter") {
      await sequelize.sync({ alter: true }); console.log("✅ All tables were successfully synchronized.");
    }

  

    return { User, Goal, Objective };
  } catch (error) {
    console.error("❌ Error synchronizing the database:", error);
    throw error;
  }
}
