import {ChangePasswordForm, EditUserForm, LoginForm, User, UserForm} from "../models/user";
import {pool} from '../db/database';
import {NOT_FOUND_RESPONSE} from "../utils/messages";


export class UserRepository {
    static async getUserById(user_id: number): Promise<User> {
        const results = await pool.query('SELECT * FROM auth_user WHERE user_id = $1', [user_id]);
        if (results.rows.length === 0) {
            throw NOT_FOUND_RESPONSE;
        }

        const row = results.rows[0];
        return new User(
            row.userId,
            row.first_name,
            row.last_name,
            row.email,
            row.password,
            row.is_active
        );
    }


    static async checkEmail(email: string): Promise<boolean> {
        const results = await pool.query('SELECT user_id FROM auth_user WHERE email = $1', [email]);
        return results.rows.length === 0;
    }

    static async create(form: UserForm): Promise<User> {
        const results = await pool.query('INSERT INTO auth_user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                form.fist_name,
                form.last_name,
                form.email,
                form.password
            ]);
        if (results.rows.length === 0) {
            throw "NO SE HA PODIDO GUARDAR EL USUARIO";
        }

        const row = results.rows[0];
        return new User(
            row.user_id,
            row.first_name,
            row.last_name,
            row.email,
            row.password,
            row.is_active
        );
    }


    static async update(form: EditUserForm): Promise<void> {
        const results = await pool.query('UPDATE auth_user SET first_name = $2, last_name = $3, modified_at = now() WHERE user_id = $1',
            [
                form.user_id,
                form.fist_name,
                form.last_name,
            ]);
        if (results.rowCount === 0) {
            throw "NO SE HA PODIDO EDITAR EL USUARIO";
        }
    }

    static async login(form: LoginForm): Promise<User> {
        const results = await pool.query('select * from auth_user where email = $1 and is_active = true',
            [
                form.email,
            ]);
        if (results.rows.length === 0) {
            throw "EMAIL O CONTRASEÑA INCORRECTOS";
        }

        const row = results.rows[0];
        return new User(
            row.user_id,
            row.first_name,
            row.last_name,
            row.email,
            row.password,
            row.is_active
        );
    }




    static async changePassword(form: ChangePasswordForm): Promise<void> {
        const results = await pool.query('UPDATE auth_user SET password=$2, modified_at = now() WHERE user_id = $1',
            [
                form.user_id,
                form.password,

            ]);
        if (results.rowCount === 0) {
            throw "NO SE HA PODIDO ACTUALIZAR LA CONTRASEÑA";
        }
    }

    static async recoverPassword(email: string, token: string): Promise<void> {
        const results = await pool.query('INSERT INTO recovery_tokens (token, email) VALUES ($1, $2) RETURNING *',
            [
                email,
                token,
            ]);
        if (results.rows.length === 0) {
            throw "NO SE HA PODIDO GUARDAR EL USUARIO";
        }
    }

}
