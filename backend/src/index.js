import connectToPostgres from "./DB/connection.js"
import config from "./config.js";
import app from "./app.js";
import createTables from "./models/index.js";


// Server is listening
app.listen(app.get('port'), () => {
    console.log("Server listening on port ", app.get("port"));
});

// Connection with DB
config.postgres.client = await connectToPostgres();

// Tables creation
createTables(config.postgres.client);


