import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as logSearchRegister from './app/controllers/api/v1/logSearch';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

logSearchRegister.registor(app);

app.listen(port, () => {
  console.log(`️[server]: Server is running at http://localhost:${port}`);
});