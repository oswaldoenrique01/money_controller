import {Response} from "express";
import {NOT_FOUND_RESPONSE} from "./messages";

export function jsonErrorResponse(response: Response, data: any) {
    if (typeof data === 'string') {
        switch (data) {
            case NOT_FOUND_RESPONSE:
                return response.status(404).json({"detail": data});
            default:
                return response.status(400).json({"detail": data});
        }
    }

    return response.status(400).json(data);
}


