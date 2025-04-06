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
      console.log("✅ DB Restarted");
    } else if (process.env.SYNC_DB === "alter") {
      await sequelize.sync({ alter: true });
      console.log("✅ All tables were successfully synchronized.");
    }

    if (process.env.INIT_USERS === "true") await initUsers(User);

    if (process.env.INIT_GOALS_AND_OBJECTIVES === "true")
      await initGoalsAndObjetives(User, Goal, Objective);

    return { User, Goal, Objective };
  } catch (error) {
    console.error("❌ Error synchronizing the database:", error);
    throw error;
  }
}

async function initUsers(User) {
  await User.create({
    id: uuidv4(),
    username: "brian",
    password: await bcrypt.hash(
      "12345678",
      Number(process.env.SALTS_ROUNDS) || 10
    ),
    name: "Admin",
    lastName: "Root",
  });
  console.log("✅ Default root user created.");
}

async function initGoalsAndObjetives(User, Goal, Objective) {
  const [rootUser] = await User.findOrCreate({
    where: { username: "brian" },
    defaults: {
      id: uuidv4(),
      username: "brian",
      password: await bcrypt.hash(
        "12345678",
        Number(process.env.SALTS_ROUNDS) || 10
      ),
      name: "Admin",
      lastName: "Root",
    },
  });
  // Insert goals
  const goals = await Goal.bulkCreate([
    {
      userId: rootUser.id,
      title: "Meta 1",
      description: "Descripción de la meta 1",
    },
    {
      userId: rootUser.id,
      title: "Meta 2",
      description: "Descripción de la meta 2",
    },
    {
      userId: rootUser.id,
      title: "Meta 3",
      description: "Descripción de la meta 3",
    },
    {
      userId: rootUser.id,
      title: "Meta 4",
      description: "Descripción de la meta 4",
    },
    {
      userId: rootUser.id,
      title: "Meta 5",
      description: "Descripción de la meta 5",
    },
    {
      userId: rootUser.id,
      title: "Meta 6",
      description: "Descripción de la meta 6",
    },
    {
      userId: rootUser.id,
      title: "Meta 7",
      description: "Descripción de la meta 7",
    },
  ]);

  console.log("✅ 7 goals inserted.");

  // Insert objectives
  await Objective.bulkCreate([
    {
      goalId: 1,
      userId: rootUser.id,
      title: "Objetivo 1.1",
      description: "Descripción del objetivo 1.1",
      goalListOrder: 1,
    },
    {
      goalId: 1,
      userId: rootUser.id,
      title: "Objetivo 1.2",
      description: "Descripción del objetivo 1.2",
      goalListOrder: 2,
    },
    {
      goalId: 1,
      userId: rootUser.id,
      title: "Objetivo 1.3",
      description: "Descripción del objetivo 1.3",
      goalListOrder: 3,
    },

    {
      goalId: 2,
      userId: rootUser.id,
      title: "Objetivo 2.1",
      description: "Descripción del objetivo 2.1",
      goalListOrder: 1,
    },
    {
      goalId: 2,
      userId: rootUser.id,
      title: "Objetivo 2.2",
      description: "Descripción del objetivo 2.2",
      goalListOrder: 2,
    },

    {
      goalId: 3,
      userId: rootUser.id,
      title: "Objetivo 3.1",
      description: "Descripción del objetivo 3.1",
      goalListOrder: 1,
    },
  ]);

  console.log("✅ Objectives inserted.");
}
