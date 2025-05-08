import app from "./app.js";
import connectToPostgres from "./DB/connection.js";
import createTables from "./models/index.js";


let models = null; 

export async function startServer() {
  try {
    // BD connection
    const sequelize = await connectToPostgres();
    
    models = await createTables(sequelize);

    // Initialize server
    app.listen(app.get('port'), () => {
      console.log("Server listening on port ", app.get("port"));
    });

    return models;
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}


startServer();

export function getModels() {
  if (!models) {
    throw new Error(" Models are not initialized yet. Wait for startServer()");
  }
  return models;
}