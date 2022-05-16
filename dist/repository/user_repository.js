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
exports.UserRepository = void 0;
const user_1 = require("../models/user");
const database_1 = require("../db/database");
const messages_1 = require("../utils/messages");
class UserRepository {
    static getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('SELECT * FROM auth_user WHERE user_id = $1', [user_id]);
            if (results.rows.length === 0) {
                throw messages_1.NOT_FOUND_RESPONSE;
            }
            const row = results.rows[0];
            return new user_1.User(row.userId, row.first_name, row.last_name, row.email, row.password, row.is_active);
        });
    }
    static checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('SELECT user_id FROM auth_user WHERE email = $1', [email]);
            return results.rows.length === 0;
        });
    }
    static create(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('INSERT INTO auth_user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [
                form.fist_name,
                form.last_name,
                form.email,
                form.password
            ]);
            if (results.rows.length === 0) {
                throw "NO SE HA PODIDO GUARDAR EL USUARIO";
            }
            const row = results.rows[0];
            return new user_1.User(row.user_id, row.first_name, row.last_name, row.email, row.password, row.is_active);
        });
    }
    static update(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('UPDATE auth_user SET first_name = $2, last_name = $3, modified_at = now() WHERE user_id = $1', [
                form.user_id,
                form.fist_name,
                form.last_name,
            ]);
            if (results.rowCount === 0) {
                throw "NO SE HA PODIDO EDITAR EL USUARIO";
            }
        });
    }
    static login(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('select * from auth_user where email = $1 and is_active = true', [
                form.email,
            ]);
            if (results.rows.length === 0) {
                throw "EMAIL O CONTRASEÑA INCORRECTOS";
            }
            const row = results.rows[0];
            return new user_1.User(row.user_id, row.first_name, row.last_name, row.email, row.password, row.is_active);
        });
    }
    static changePassword(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('UPDATE auth_user SET password=$2, modified_at = now() WHERE user_id = $1', [
                form.user_id,
                form.password,
            ]);
            if (results.rowCount === 0) {
                throw "NO SE HA PODIDO ACTUALIZAR LA CONTRASEÑA";
            }
        });
    }
    static recoverPassword(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('INSERT INTO recovery_tokens (token, email) VALUES ($1, $2) RETURNING *', [
                email,
                token,
            ]);
            if (results.rows.length === 0) {
                throw "NO SE HA PODIDO GUARDAR EL USUARIO";
            }
        });
    }
}
exports.UserRepository = UserRepository;
