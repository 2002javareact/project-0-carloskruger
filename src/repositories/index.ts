import { Pool } from 'pg';


// This code was added because of two random variables that were
// added to the environmental variables

let USER = process.env['PROJECT_USER']
USER = USER.substring(0,USER.length -2)
let DB = process.env['PROJECT_DB_NAME']
DB = DB.substring(0,DB.length -2)
let PWD = process.env['PROJECT_PASSWORD']
PWD = PWD.substring(0,PWD.length -2)

export const connectionPool:Pool = new Pool(
{
   
    
    

    host: process.env['PROJECT_HOST'],
    database: DB,
    user: USER,
    password: PWD,
    port: 5432,
    max: 5

})
