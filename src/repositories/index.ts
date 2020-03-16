import { Pool } from "pg";
const dotenv = require("dotenv");
dotenv.config();

// This code was added because of two random variables that were
// added to the environmental variables

// let USER = process.env['PROJECT_USER']
// USER = USER.substring(0,USER.length - 9)
// let DB = process.env['PROJECT_DB_NAME']
// DB = DB.substring(0,DB.length - 1)
// let PWD = process.env['PROJECT_PASSWORD']
// PWD = PWD.substring(0,PWD.length - 11)
// let HOST =

export const connectionPool: Pool = new Pool({
	host: process.env.HOST,
	database: process.env.DATABASE,
	user: process.env.PG_USER,
	password: process.env.PASSWORD,
	port: 5432,
	max: 5
});
