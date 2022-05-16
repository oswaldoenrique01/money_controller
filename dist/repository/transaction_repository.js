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
exports.TransactionRepository = void 0;
const database_1 = require("../db/database");
const messages_1 = require("../utils/messages");
const transaction_1 = require("../models/transaction");
class TransactionRepository {
    static getTransactionId(transaction_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('SELECT * FROM transactions t INNER JOIN transaction_types tt on tt.type_id = t.transaction_type_id where user_id = $1 AND transaction_id = $2', [user_id, transaction_id]);
            if (results.rows.length === 0) {
                throw messages_1.NOT_FOUND_RESPONSE;
            }
            const row = results.rows[0];
            return new transaction_1.Transaction(row.transaction_id, row.amount, row.description, row.user_id, new transaction_1.TransactionType(row.type_id, row.description_type, row.inbound));
        });
    }
    static transactionType(transaction_type_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('SELECT * FROM transaction_types WHERE type_id = $1 AND status = TRUE', [transaction_type_id]);
            if (results.rows.length === 0) {
                throw messages_1.NOT_FOUND_RESPONSE;
            }
            const row = results.rows[0];
            return new transaction_1.TransactionType(row.type_id, row.description_type, row.inbound);
        });
    }
    static transaction(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield database_1.pool.query('INSERT INTO transactions (amount, transaction_type_id, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *', [
                form.amount,
                form.transaction_type_id,
                form.description,
                form.user_id
            ]);
            if (results.rows.length === 0) {
                throw "No se ha podido crear la transacción";
            }
            const row = results.rows[0];
            return new transaction_1.Transaction(row.transaction_id, row.amount, row.description, row.user_id, yield this.transactionType(row.transaction_type_id));
        });
    }
}
exports.TransactionRepository = TransactionRepository;
