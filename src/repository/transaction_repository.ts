import {pool} from '../db/database';
import {NOT_FOUND_RESPONSE} from "../utils/messages";
import {FirstAmountForm, Transaction, TransactionType} from "../models/transaction";

export class TransactionRepository {
    static async getTransactionId(transaction_id: number, user_id: number): Promise<Transaction> {
        const results = await pool.query('SELECT * FROM transactions t INNER JOIN transaction_types tt on tt.type_id = t.transaction_type_id where user_id = $1 AND transaction_id = $2', [user_id, transaction_id]);
        if (results.rows.length === 0) {
            throw NOT_FOUND_RESPONSE;
        }

        const row = results.rows[0];
        return new Transaction(
            row.transaction_id,
            row.amount,
            row.description,
            row.user_id,
            new TransactionType(row.type_id, row.description_type, row.inbound)
        );
    }

    static async transactionType(transaction_type_id: number): Promise<TransactionType> {
        const results = await pool.query('SELECT * FROM transaction_types WHERE type_id = $1 AND status = TRUE', [transaction_type_id]);
        if (results.rows.length === 0) {
            throw NOT_FOUND_RESPONSE;
        }
        const row = results.rows[0];
        return new TransactionType(
            row.type_id,
            row.description_type,
            row.inbound,
        );
    }

    static async transaction(form: FirstAmountForm): Promise<Transaction> {
        const results = await pool.query('INSERT INTO transactions (amount, transaction_type_id, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                form.amount,
                form.transaction_type_id,
                form.description,
                form.user_id
            ]);
        if (results.rows.length === 0) {
            throw "No se ha podido crear la transacción";
        }

        const row = results.rows[0];
        return new Transaction(
            row.transaction_id,
            row.amount,
            row.description,
            row.user_id,
            await this.transactionType(row.transaction_type_id)
        );
    }

}