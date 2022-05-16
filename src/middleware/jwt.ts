import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user";

const config = process.env;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token && token?.startsWith('Bearer ')) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // @ts-ignore
        req.user = jwt.verify(token?.slice(7, token?.length), config.TOKEN_KEY || "");
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}


export function createUserToken(user: User): string {
    return jwt.sign(
        {user_id: user.id, email: user.email},
        config.TOKEN_KEY || "",
        {
            expiresIn: "9999d",
        }
    )
}


export function getUserId(request: Request): number {
    // @ts-ignore
    return Number(request.user.user_id);

}


export function getTransactionUserId(request: Request): number {
    // @ts-ignore
    return Number(request.transaction.user_id);

}