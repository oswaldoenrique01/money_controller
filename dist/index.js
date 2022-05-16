"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_controller_1 = require("./controllers/user_controller");
const body_parser_1 = __importDefault(require("body-parser"));
const express_validator_1 = require("express-validator");
const message_validator_1 = require("./utils/message_validator");
const jwt_1 = require("./middleware/jwt");
const transaction_controller_1 = require("./controllers/transaction_controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const port = process.env.PORT;
const userController = new user_controller_1.UserController();
const transactionController = new transaction_controller_1.TransactionController();
app.post('/login/', [(0, express_validator_1.body)('email', message_validator_1.EMAIL_INVALID).isEmail(), (0, express_validator_1.body)('password', message_validator_1.NO_EMPTY).notEmpty().isLength({ min: 1, max: 20, }).withMessage("Debe tener minimo 8 caracteres y maximo 20 caracteres")], userController.login);
app.get('/user/', jwt_1.verifyToken, userController.getUser);
app.post('/user/create', [(0, express_validator_1.body)('email', message_validator_1.EMAIL_INVALID).isEmail(), (0, express_validator_1.body)('password', message_validator_1.NO_EMPTY).notEmpty().isLength({ min: 8, max: 20, }).withMessage("Debe tener minimo 8 caracteres y maximo 20 caracteres"), (0, express_validator_1.body)('first_name', message_validator_1.NO_EMPTY), (0, express_validator_1.body)('last_name', message_validator_1.NO_EMPTY),], userController.createUser);
app.put('/user/edit/', jwt_1.verifyToken, [(0, express_validator_1.body)('first_name', message_validator_1.NO_EMPTY).notEmpty()], userController.editUser);
app.put('/user/edit/password', jwt_1.verifyToken, userController.changePassword);
app.post('/user/recover', userController.forgotPassword);
//transaction
app.get('/transaction/:id', jwt_1.verifyToken, transactionController.getTransaction);
app.post('/transaction/create/', jwt_1.verifyToken, [(0, express_validator_1.body)('amount', message_validator_1.IS_NUMBER).isNumeric(), (0, express_validator_1.body)('transaction_type_id', message_validator_1.IS_NUMBER).isNumeric()], transactionController.createTransaction);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
