export class User {
    id: number;
    fist_name: string;
    last_name: string;
    email: string
    password: string;
    is_active: boolean;


    constructor(id: number, fist_name: string, last_name: string, email: string, password: string, is_active: boolean) {
        this.id = id;
        this.fist_name = fist_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.is_active = is_active;
    }


    toJson(): any {
        return {
            "user_id": this.id,
            "first_name": this.fist_name,
            "last_name": this.last_name,
            "email": this.email
        }
    }
}


export class UserForm {
    fist_name: string;
    last_name: string;
    email: string
    password: string;


    constructor(fist_name: string, last_name: string, email: string, password: string) {
        this.fist_name = fist_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }
}


export class EditUserForm {
    user_id: number;
    fist_name: string;
    last_name: string;


    constructor(user_id: number, fist_name: string, last_name: string,) {
        this.user_id = user_id;
        this.fist_name = fist_name;
        this.last_name = last_name;
    }
}

export class LoginForm {
    email: string;
    password: string;


    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export class ChangePasswordForm {
    user_id: number;
    old_password: string;
    password: string;

    constructor(user_id: number, old_password: string, password: string) {
        this.user_id = user_id;
        this.old_password = old_password;
        this.password = password;

    }
}

export class ForgotPassword {
    token: string;
    email: string;


    constructor(token: string, email: string) {
        this.token = token;
        this.email = email;
    }
}
