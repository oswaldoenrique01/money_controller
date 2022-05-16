"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonErrorResponse = void 0;
const messages_1 = require("./messages");
function jsonErrorResponse(response, data) {
    if (typeof data === 'string') {
        switch (data) {
            case messages_1.NOT_FOUND_RESPONSE:
                return response.status(404).json({ "detail": data });
            default:
                return response.status(400).json({ "detail": data });
        }
    }
    return response.status(400).json(data);
}
exports.jsonErrorResponse = jsonErrorResponse;
