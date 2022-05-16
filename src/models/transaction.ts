export class TransactionType {
    type_id: number;
    description: string;
    inbound: boolean;

    constructor(type_id: number, description: string, inbound: boolean) {
        this.type_id = type_id;
        this.description = description;
        this.inbound = inbound;
    }
}


export class Transaction {
    transaction_id: number;
    amount: number;
    description: string;
    user_id: number
    transaction_type: TransactionType;


    constructor(transaction_id: number, amount: number, description: string, user_id: number, transaction_type: TransactionType) {
        this.transaction_id = transaction_id;
        this.amount = amount;
        this.description = description;
        this.user_id = user_id;
        this.transaction_type = transaction_type;
    }
}


export class FirstAmountForm {
    amount: number;
    transaction_type_id: number;
    description: string;
    user_id: number


    constructor(amount: number, transaction_type_id: number, description: string, user_id: number) {
        this.amount = amount;
        this.transaction_type_id = transaction_type_id;
        this.description = description;
        this.user_id = user_id;
    }
}

