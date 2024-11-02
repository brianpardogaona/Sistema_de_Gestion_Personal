const app = require('./app');
const connection = require('./DB/connection');
const config = require('./config');

// Server is listening
app.listen(app.get('port'), () => {
    console.log("Server listening on port ", app.get("port"));
});

// Connection with DB
config.postgres.client = connection.connect;

