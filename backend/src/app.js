const express = require('express');
const config = require('./config');

const app = express();

const users = require('./modules/users/routes');

// port config
app.set('port', config.app.port);

// routes
app.use('/api/users', users);



module.exports = app;