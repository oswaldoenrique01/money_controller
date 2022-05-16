"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_repository_1 = require("../repository/user_repository");
const user_1 = require("../models/user");
const express_validator_1 = require("express-validator");
const messages_1 = require("../utils/messages");
const bcrypt = require("bcrypt");
const jwt_1 = require("../middleware/jwt");
const response_1 = require("../utils/response");
const email_1 = require("../utils/email");
const randomstring_1 = require("randomstring");
class UserController {
    getUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_repository_1.UserRepository.getUserById((0, jwt_1.getUserId)(request));
                response.json(user.toJson());
            }
            catch (e) {
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
    createUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
            yield bcrypt.hash(request.body.password, 10, (error, hash) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    response.json({ "detail": "Ha ocurrido un error con el hash*", "code": 403 });
                    return;
                }
                else {
                    try {
                        const form = new user_1.UserForm(request.body.first_name, request.body.last_name, request.body.email, hash);
                        if (!(yield user_repository_1.UserRepository.checkEmail(form.email))) {
                            response.json({ "detail": "Email ya se encuentra registrado", "code": 400 });
                            response.status(400);
                            return;
                        }
                        const user = yield user_repository_1.UserRepository.create(form);
                        response.json({
                            "user": user.toJson(),
                            "token": (0, jwt_1.createUserToken)(user)
                        });
                    }
                    catch (e) {
                        console.log(e);
                        (0, response_1.jsonErrorResponse)(response, e);
                    }
                }
            }));
        });
    }
    editUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return response.status(400).json({ errors: errors.array() });
                }
                const form = new user_1.EditUserForm((0, jwt_1.getUserId)(request), request.body.first_name, request.body.last_name);
                yield user_repository_1.UserRepository.update(form);
                response.json(messages_1.OK_RESPONSE);
            }
            catch (e) {
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return response.status(400).json({ errors: errors.array() });
                }
                const form = new user_1.LoginForm(request.body.email, request.body.password);
                const user = yield user_repository_1.UserRepository.login(form);
                const hash = bcrypt.compareSync(request.body.password, user.password);
                if (!hash) {
                    return response.json({
                        "message": "EMAIL O CONTRASEÑA INCORRECTOS", "code": 401
                    });
                }
                response.json({
                    "user": user.toJson(),
                    "token": (0, jwt_1.createUserToken)(user)
                });
            }
            catch (e) {
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
    changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return response.status(400).json({ errors: errors.array() });
                }
                const password = yield bcrypt.hash(request.body.password, 10);
                const old_password = request.body.old_password;
                const user = yield user_repository_1.UserRepository.getUserById((0, jwt_1.getUserId)(request));
                const form = new user_1.ChangePasswordForm((0, jwt_1.getUserId)(request), old_password, password);
                const hash = bcrypt.compareSync(form.old_password, user.password);
                if (!hash) {
                    return response.json({
                        "message": "EMAIL O CONTRASEÑA INCORRECTOS", "code": 401
                    });
                }
                yield user_repository_1.UserRepository.changePassword(form);
                response.json(messages_1.OK_RESPONSE);
            }
            catch (e) {
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
    forgotPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, randomstring_1.generate)({
                    length: 50,
                });
                const email = request.body.email;
                const url = `http://localhost:4200/reset-password?email=${email}&token=${token}`;
                yield user_repository_1.UserRepository.recoverPassword(email, token);
                yield (0, email_1.sendMail)(email, url);
                response.json(messages_1.OK_RESPONSE);
            }
            catch (e) {
                console.log(e);
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
}
exports.UserController = UserController;
