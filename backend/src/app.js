import express from 'express';
import config from './config.js';
import user from './routes/user.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// port config
const app = express();
app.set('port', config.app.port);

// allowing the server to receive json format reponses from client
app.use(express.json());

// allowing cors
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"], 
}));

//  allowing save the token in cookies
app.use(cookieParser());
// routes
app.use('/api/user', user);

export default app;
