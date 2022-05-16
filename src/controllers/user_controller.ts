import {Request, Response} from 'express';
import {UserRepository} from "../repository/user_repository";
import {ChangePasswordForm, EditUserForm, LoginForm, User, UserForm} from "../models/user";
import {validationResult} from "express-validator";
import {OK_RESPONSE} from "../utils/messages"
import bcrypt = require("bcrypt");
import {createUserToken, getUserId} from "../middleware/jwt";
import {jsonErrorResponse} from "../utils/response";
import {sendMail} from "../utils/email";
import {generate as generateRandomString} from "randomstring";


export class UserController {


    async getUser(request: Request, response: Response): Promise<void> {
        try {
            const user = await UserRepository.getUserById(getUserId(request));
            response.json(user.toJson());
        } catch (e) {
            jsonErrorResponse(response, e);
        }

    }

    async createUser(request: Request, response: Response): Promise<any> {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }

        await bcrypt.hash(request.body.password, 10, async (error: any, hash: string) => {
            if (error) {
                response.json({"detail": "Ha ocurrido un error con el hash*", "code": 403})
                return;
            } else {
                try {
                    const form = new UserForm(request.body.first_name, request.body.last_name, request.body.email, hash);
                    if (!await UserRepository.checkEmail(form.email)) {
                        response.json({"detail": "Email ya se encuentra registrado", "code": 400});
                        response.status(400);
                        return;
                    }
                    const user = await UserRepository.create(form);
                    response.json(
                        {
                            "user": user.toJson(),
                            "token": createUserToken(user)
                        }
                    );
                } catch (e) {
                    console.log(e);
                    jsonErrorResponse(response, e);
                }
            }
        });
    }


    async editUser(request: Request, response: Response): Promise<any> {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }
            const form = new EditUserForm(getUserId(request), request.body.first_name, request.body.last_name);
            await UserRepository.update(form);
            response.json(OK_RESPONSE);
        } catch (e) {
            jsonErrorResponse(response, e);
        }

    }

    async login(request: Request, response: Response): Promise<any> {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }
            const form = new LoginForm(request.body.email, request.body.password);
            const user = await UserRepository.login(form);
            const hash = bcrypt.compareSync(request.body.password, user.password);
            if (!hash) {
                return response.json({
                    "message": "EMAIL O CONTRASEÑA INCORRECTOS", "code": 401
                });
            }
            response.json(
                {
                    "user": user.toJson(),
                    "token": createUserToken(user)
                }
            );
        } catch (e) {
            jsonErrorResponse(response, e);
        }

    }

    async changePassword(request: Request, response: Response): Promise<any> {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }
            const password = await bcrypt.hash(request.body.password, 10);
            const old_password = request.body.old_password;
            const user = await UserRepository.getUserById(getUserId(request));
            const form = new ChangePasswordForm(getUserId(request), old_password, password);
            const hash = bcrypt.compareSync(form.old_password, user.password);
            if (!hash) {
                return response.json({
                    "message": "EMAIL O CONTRASEÑA INCORRECTOS", "code": 401
                });
            }
            await UserRepository.changePassword(form);

            response.json(OK_RESPONSE);
        } catch (e) {
            jsonErrorResponse(response, e);
        }
    }

    async forgotPassword(request: Request, response: Response): Promise<any> {
        try {
            const token = generateRandomString({
                length: 50,
            });
            const email = request.body.email;
            const url = `http://localhost:4200/reset-password?email=${email}&token=${token}`
            await UserRepository.recoverPassword(email, token);
            await sendMail(email, url);
            response.json(OK_RESPONSE);
        } catch (e) {
            console.log(e);
            jsonErrorResponse(response, e);
        }
    }
}
