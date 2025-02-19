import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Objective = sequelize.define(
    "Objective",
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
        field: "userId",
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      goalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Goal",
          key: "id",
        },
        onDelete: "CASCADE",
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, 
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true, 
      },
    },
    {
      tableName: "Objective",
      timestamps: false,
    }
  );



  return Objective;
};
