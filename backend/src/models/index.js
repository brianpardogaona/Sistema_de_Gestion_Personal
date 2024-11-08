import User from "./User.js";

export default async function createTables(sequelize){
    const user = User(sequelize);
    User(sequelize)
    sequelize.sync(); // {alter: true}
    console.log("All models were synchronized successfully.");
    //
  //  const jane = await user.create( {username: 'jane2', name: 'Jane', lastName: 'Doe', password: 123});

   
}
