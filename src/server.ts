import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import app from './app'

dotenv.config();
const port = process.env.PORT;

const options = {
  swaggerDefinition: {
    info: {
      title: "Var log serach JS",
      version: "1.0.0"
    }
  },
  apis: ['./**/*.ts']
};
app.use("/docs/api/v1/", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));

app.listen(port, () => {
  console.log(`️[server]: Server is running at http://localhost:${port}`);
});