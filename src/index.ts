import express, {Express, Request, Response,} from 'express';
import dotenv from 'dotenv';
import {UserController} from "./controllers/user_controller";
import bodyParser from 'body-parser';
import {body, validationResult} from 'express-validator';
import {EMAIL_INVALID, IS_NUMBER, NO_EMPTY} from "./utils/message_validator";
import {verifyToken} from "./middleware/jwt";
import {TransactionController} from "./controllers/transaction_controller";


dotenv.config();

const app: Express = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const port = process.env.PORT;

const userController = new UserController();
const transactionController = new TransactionController();

app.post('/login/', [body('email', EMAIL_INVALID).isEmail(), body('password', NO_EMPTY).notEmpty().isLength({min:1, max: 20,}).withMessage("Debe tener minimo 8 caracteres y maximo 20 caracteres")], userController.login);
app.get('/user/', verifyToken, userController.getUser);
app.post('/user/create', [body('email', EMAIL_INVALID).isEmail(), body('password', NO_EMPTY).notEmpty().isLength({min:8, max: 20,}).withMessage("Debe tener minimo 8 caracteres y maximo 20 caracteres"), body('first_name', NO_EMPTY), body('last_name', NO_EMPTY),], userController.createUser);
app.put('/user/edit/', verifyToken, [body('first_name', NO_EMPTY).notEmpty()], userController.editUser);
app.put('/user/edit/password', verifyToken, userController.changePassword);
app.post('/user/recover', userController.forgotPassword);
app.use("/auth");
app.listen(3000, ()=> console.log("http://localhost:3000"));

//transaction
app.get('/transaction/:id', verifyToken, transactionController.getTransaction);
app.post('/transaction/create/', verifyToken, [body('amount', IS_NUMBER).isNumeric(), body('transaction_type_id', IS_NUMBER).isNumeric()], transactionController.createTransaction);


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
