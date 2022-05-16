"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = exports.ChangePasswordForm = exports.LoginForm = exports.EditUserForm = exports.UserForm = exports.User = void 0;
class User {
    constructor(id, fist_name, last_name, email, password, is_active) {
        this.id = id;
        this.fist_name = fist_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.is_active = is_active;
    }
    toJson() {
        return {
            "user_id": this.id,
            "first_name": this.fist_name,
            "last_name": this.last_name,
            "email": this.email
        };
    }
}
exports.User = User;
class UserForm {
    constructor(fist_name, last_name, email, password) {
        this.fist_name = fist_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }
}
exports.UserForm = UserForm;
class EditUserForm {
    constructor(user_id, fist_name, last_name) {
        this.user_id = user_id;
        this.fist_name = fist_name;
        this.last_name = last_name;
    }
}
exports.EditUserForm = EditUserForm;
class LoginForm {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.LoginForm = LoginForm;
class ChangePasswordForm {
    constructor(user_id, old_password, password) {
        this.user_id = user_id;
        this.old_password = old_password;
        this.password = password;
    }
}
exports.ChangePasswordForm = ChangePasswordForm;
class ForgotPassword {
    constructor(token, email) {
        this.token = token;
        this.email = email;
    }
}
exports.ForgotPassword = ForgotPassword;
