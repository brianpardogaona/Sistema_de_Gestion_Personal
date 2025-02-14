import express from 'express';
import config from './config.js';
import user from './routes/user.js';
import goal from './routes/goal.js';
import objective from './routes/objective.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// port config
const app = express();
app.set('port', config.app.port);

// allows the server to receive json format reponses from client
app.use(express.json());

// allows cors - receive requests from any origin 
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"], 
}));

//  allows saving the token in cookies
app.use(cookieParser());
// routes
app.use('/api/user', user);
app.use('/api/goal', goal);
app.use('/api/objective', objective);

export default app;
