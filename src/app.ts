import express, { Express } from 'express';
import { initialize } from 'express-openapi';

import * as logSearchRegister from './controllers/api/v1/logSearch';

const app: Express = express();

logSearchRegister.registor(app);

export = app;