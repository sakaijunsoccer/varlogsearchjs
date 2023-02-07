import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

import * as logSearchRegister from './app/controllers/api/v1/logSearch';

// app.get('/api/v1/search', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

logSearchRegister.registor(app);
//app.get('/api/v1/search', logSearch.getEvents);

app.listen(port, () => {
  console.log(`️[server]: Server is running at http://localhost:${port}`);
});