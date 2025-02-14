import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Goal = sequelize.define(
    "Goal",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.ENUM("pending", "inprogress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      objectives: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Goal;
};
