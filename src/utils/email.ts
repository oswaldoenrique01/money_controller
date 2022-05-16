import {createTestAccount, createTransport, getTestMessageUrl} from 'nodemailer';
import dotenv from 'dotenv';

export async function sendMail(email: string, message: string): Promise<any> {
    const EMAIL = process.env.EMAIL;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    let testAccount = await createTestAccount();
    console.log("dsdhjdfjsdhuivsda");
    // create reusable transporter object using the default SMTP transport
    let transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: EMAIL, // generated ethereal user
            pass: EMAIL_PASSWORD, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"CAMBIAR LA CONTRASEÑA" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "ESTE ES LINK PARA CAMBIAR SU CONTRASEÑA", // Subject line
        text: message, // plain text body
        html: `<a href='${message}'>${message}</a>`, // html body
    });



}
