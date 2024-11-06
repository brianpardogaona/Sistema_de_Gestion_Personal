import express from 'express';
import config from './config.js';


// port config
const app = express();
app.set('port', config.app.port);

// routes
// app.use('/api/users', users);


export default app;
