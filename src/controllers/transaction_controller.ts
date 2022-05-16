import {Request, Response} from "express";
import {getUserId} from "../middleware/jwt";
import {TransactionRepository} from "../repository/transaction_repository";
import {jsonErrorResponse} from "../utils/response";
import {validationResult} from "express-validator";
import {OK_RESPONSE} from "../utils/messages";
import {FirstAmountForm} from "../models/transaction";


export class TransactionController {
    async getTransaction(request: Request, response: Response): Promise<void> {
        try {
            const transaction = await TransactionRepository.getTransactionId(Number(request.params.id), getUserId(request));
            response.json(transaction);
        } catch (e) {
            jsonErrorResponse(response, e);
        }

    }


    async createTransaction(request: Request, response: Response): Promise<any> {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            const form = new FirstAmountForm(request.body.amount, request.body.transaction_type_id, request.body.description, getUserId(request));

            const transaction_type = await TransactionRepository.transactionType(form.transaction_type_id);

            if (transaction_type.inbound && form.amount <= 0) {
                return jsonErrorResponse(response, "Los ingresos deben ser mayores a 0");
            }

            if (!transaction_type.inbound && form.amount >= 0) {
                return jsonErrorResponse(response, "Los gastos deben ser menores a 0");
            }
            response.status(201).json(await TransactionRepository.transaction(form));
            console.log(form);
        } catch (e) {
            console.log(e);
            jsonErrorResponse(response, e);
        }

    }
}