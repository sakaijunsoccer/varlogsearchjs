import * as express from "express";
import fs from 'fs';
import path from "path"

import EventLog from "../../../models/eventLog"


const defaultSearchLogLine = 5;
const pathVarLog = '/var/log';

interface ReqQuery {
    filename: string
    keywords: string
    limit: number
}

interface ResonseJson{
    events: string[]
    errorMessage?: string
}

export const registor = ( app: express.Application ) => {
    /**
     * @swagger
     * /api/v1/search:
     *   get:
     *     summary: Keyword search for files in /var/log
     *     description: Search files in /var/log by keyword and return log lines found, starting with the most recent
     *     parameters:
     *       - in: query
     *         name: filename
     *         required: true
     *         description: filename to search
     *         schema:
     *           type: string
     *       - in: query
     *         name: keywords
     *         required: true
     *         description: Keywords to search for, separated by commas ex) test,test
     *         schema:
     *           type: string
     *       - in: query
     *         name: limit
     *         required: false
     *         description: Limit number of loglines found in search. Default is 5.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A list of log.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 events:
     *                   type: array
     *                   items:
     *                     log:
     *                       type: string
     *                       description: log line
     *                       example: "log 1"
     */
    app.get( "/api/v1/search", async ( request: express.Request<unknown, unknown, unknown, ReqQuery>, response: express.Response) => {
        const filename: string = request.query?.filename ?? '';
        if (!filename) {
            return response.status(400).send({errorMessage: "filename is required"})
        }
        const keywords: string = request.query?.keywords ?? '';
        if (!keywords) {
            return response.status(400).send({errorMessage: "keywords is required"})
        }
        const keywordsList = keywords.split(',')
        const limit: number = request.query?.limit ?? defaultSearchLogLine;

        console.log({
            "action": "/api/v1/search",
            "filename": filename,
            "keywords": keywords,
            "limit": limit,
        })
        
        const fullFilePath = path.join(pathVarLog, filename);
        if (!fs.existsSync(fullFilePath)) {
            console.debug({
                "action": "/api/v1/search",
                "filename": filename,
                "keywords": keywords,
                "limit": limit,
                "status": "no_file"
            })
            return response.status(400).send({errorMessage: `${filename} does not exist`})
        }

        // TODO (sakaijunsoccer) Use queing system to execute CPU bound
        const eventLog = new EventLog(fullFilePath);
        const [events, isTimeout] = eventLog.findEvent(keywordsList, limit)

        console.log({
            "action": "/api/v1/search",
            "filename": filename,
            "keywords": keywords,
            "limit": limit,
            "events": events,
            "isTimeout": isTimeout,
        })

        const responseJson: ResonseJson = { events: events}
        if (isTimeout){
            responseJson['errorMessage'] = 'timeout'
        }
        response.json(responseJson)

    });
};