import * as express from "express";
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
            response.json({errorMessage: "filename is required"})
        }
        const keywords: string = request.query?.keywords ?? '';
        if (!keywords) {
            response.json({errorMessage: "keywords is required"})
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
        const eventLog = new EventLog(fullFilePath);
        const events = eventLog.search(keywordsList, limit)
        const isTimeout= eventLog.isTimeout

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