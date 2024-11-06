import User from "./User.js";

export default function createTables(sequelize){
    User(sequelize);
    sequelize.sync({alter: true});
}
