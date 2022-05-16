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
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
function sendMail(email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const EMAIL = process.env.EMAIL;
        const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
        let testAccount = yield (0, nodemailer_1.createTestAccount)();
        console.log("dsdhjdfjsdhuivsda");
        // create reusable transporter object using the default SMTP transport
        let transporter = (0, nodemailer_1.createTransport)({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD, // generated ethereal password
            },
        });
        let info = yield transporter.sendMail({
            from: '"CAMBIAR LA CONTRASEÑA" <foo@example.com>',
            to: email,
            subject: "ESTE ES LINK PARA CAMBIAR SU CONTRASEÑA",
            text: message,
            html: `<a href='${message}'>${message}</a>`, // html body
        });
    });
}
exports.sendMail = sendMail;
