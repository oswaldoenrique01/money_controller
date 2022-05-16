import { Pool } from "pg";


export const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'moneydb',
    password: '123456789',
    port: 5432
})
