"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionUserId = exports.getUserId = exports.createUserToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = process.env;
function verifyToken(req, res, next) {
    console.log(req.headers);
    const token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token && (token === null || token === void 0 ? void 0 : token.startsWith('Bearer '))) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // @ts-ignore
        req.user = jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.slice(7, token === null || token === void 0 ? void 0 : token.length), config.TOKEN_KEY || "");
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}
exports.verifyToken = verifyToken;
function createUserToken(user) {
    return jsonwebtoken_1.default.sign({ user_id: user.id, email: user.email }, config.TOKEN_KEY || "", {
        expiresIn: "9999d",
    });
}
exports.createUserToken = createUserToken;
function getUserId(request) {
    // @ts-ignore
    return Number(request.user.user_id);
}
exports.getUserId = getUserId;
function getTransactionUserId(request) {
    // @ts-ignore
    return Number(request.transaction.user_id);
}
exports.getTransactionUserId = getTransactionUserId;
