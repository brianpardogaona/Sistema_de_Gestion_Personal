import express from 'express';
import config from './config.js';
import user from './routes/user.js';


// port config
const app = express();
app.set('port', config.app.port);

// allowing the server to receive json format reponses from client
app.use(express.json());

// routes
app.use('/api/user', user);

export default app;
