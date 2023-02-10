import os from 'os'
import cluster from 'cluster';

import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import app from './app'

dotenv.config();

const port = process.env.PORT;
const enableCluster = process.env.ENABLE_CLUSTER == "true";
const numCPUs = os.cpus().length;

if (enableCluster && cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {

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
}