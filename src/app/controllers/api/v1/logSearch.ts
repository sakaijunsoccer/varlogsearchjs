import * as express from "express";
import fs from 'fs';
import EventLog from "../../../models/eventLog"
import path from "path"

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
            console.warn({
                "action": "/api/v1/search",
                "filename": filename,
                "keywords": keywords,
                "limit": limit,
                "status": "no_file"
            })
            return response.status(400).send({errorMessage: `${filename} does not exist`})
        }

        const eventLog = new EventLog(fullFilePath);
        const [events, isTimeout] = eventLog.find_event(keywordsList, limit)

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