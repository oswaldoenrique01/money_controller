"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstAmountForm = exports.Transaction = exports.TransactionType = void 0;
class TransactionType {
    constructor(type_id, description, inbound) {
        this.type_id = type_id;
        this.description = description;
        this.inbound = inbound;
    }
}
exports.TransactionType = TransactionType;
class Transaction {
    constructor(transaction_id, amount, description, user_id, transaction_type) {
        this.transaction_id = transaction_id;
        this.amount = amount;
        this.description = description;
        this.user_id = user_id;
        this.transaction_type = transaction_type;
    }
}
exports.Transaction = Transaction;
class FirstAmountForm {
    constructor(amount, transaction_type_id, description, user_id) {
        this.amount = amount;
        this.transaction_type_id = transaction_type_id;
        this.description = description;
        this.user_id = user_id;
    }
}
exports.FirstAmountForm = FirstAmountForm;
