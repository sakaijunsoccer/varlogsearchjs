import * as express from "express";
import EventLog from "../../../models/eventLog"
import path from "path"

const defaultSearchLogLine = 5;
const pathVarLog = '/var/log';

export const registor = ( app: express.Application ) => {
    app.get( "/api/v1/search", ( request, response) => {
        const filename: string = request.query?.filename ?? '';
        if (!filename) {
            response.json({errorMessage: "filename is required"})
        }
        const keywords: string = request.query?.keywords ?? '';
        if (!keywords) {
            response.json({errorMessage: "keywords is required"})
        }
        const keywordsList = keywords.split(',')
        const limit: number = +(request.query?.limit ?? defaultSearchLogLine);
        
        const fullFilePath = path.join(pathVarLog, filename);
        const eventLog = new EventLog(fullFilePath);
        const events = eventLog.search(keywordsList, limit)
        response.json({ events: events})
    } );
};