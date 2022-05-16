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
exports.TransactionController = void 0;
const jwt_1 = require("../middleware/jwt");
const transaction_repository_1 = require("../repository/transaction_repository");
const response_1 = require("../utils/response");
const express_validator_1 = require("express-validator");
const transaction_1 = require("../models/transaction");
class TransactionController {
    getTransaction(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield transaction_repository_1.TransactionRepository.getTransactionId(Number(request.params.id), (0, jwt_1.getUserId)(request));
                response.json(transaction);
            }
            catch (e) {
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
    createTransaction(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return response.status(400).json({ errors: errors.array() });
                }
                const form = new transaction_1.FirstAmountForm(request.body.amount, request.body.transaction_type_id, request.body.description, (0, jwt_1.getUserId)(request));
                const transaction_type = yield transaction_repository_1.TransactionRepository.transactionType(form.transaction_type_id);
                if (transaction_type.inbound && form.amount <= 0) {
                    return (0, response_1.jsonErrorResponse)(response, "Los ingresos deben ser mayores a 0");
                }
                if (!transaction_type.inbound && form.amount >= 0) {
                    return (0, response_1.jsonErrorResponse)(response, "Los gastos deben ser menores a 0");
                }
                response.status(201).json(yield transaction_repository_1.TransactionRepository.transaction(form));
                console.log(form);
            }
            catch (e) {
                console.log(e);
                (0, response_1.jsonErrorResponse)(response, e);
            }
        });
    }
}
exports.TransactionController = TransactionController;
