"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'moneydb',
    password: '123456789',
    port: 5432
});
