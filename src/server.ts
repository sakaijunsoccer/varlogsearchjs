import dotenv from 'dotenv';
import * as logSearchRegister from './controllers/api/v1/logSearch';
import app from './app'

dotenv.config();
const port = process.env.PORT;
logSearchRegister.registor(app);

app.listen(port, () => {
  console.log(`️[server]: Server is running at http://localhost:${port}`);
});