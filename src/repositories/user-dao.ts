import { PoolClient } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { BadCredentialsError} from '../errors/BadCredentialsError';
import { InternalServerError } from "../errors/InternalServerError";
import { userDTOToUserConverter } from "../util/util-dto-to-user-converter";
import { UserDTO } from "../dtos/UserDTO";
import { UserNotFoundError } from "../errors/UserNotFoundError";


export async function daoFindUserByUsernameAndPassword(username:string,password:string):Promise<User>{
    let client:PoolClient// our potential connection to db
    try {
        client = await connectionPool.connect()
        // a paramaterized query
        let results = await client.query('SELECT * FROM ers.users U inner join ers.roles R on U."roleId" = R."roleId"  WHERE username = $1  and "password" = $2', [username,password])
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(results.rows[0])
    } catch(e){
        console.log(e);
        if(e.message === 'User Not Found'){
            throw new BadCredentialsError()
        }else {
            throw new InternalServerError()
        }
    } finally {
        client && client.release()
    }
}



// this function gets anf formats all users
export async function daoFindAllUsers():Promise<User[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query('SELECT * FROM ers.users U inner join ers.roles R on U."roleId" = R."roleId"')
        return results.rows.map(userDTOToUserConverter)

    }catch(e){
        throw new InternalServerError()
    } finally {
        client && client.release()
    }

}


// function that saves a new user and returns that user with its new id
export async function daoSaveOneUser(newUser:UserDTO):Promise<User> {
    let client:PoolClient
    try { 
        client = await connectionPool.connect()
        // send a query and immeadiately get the role id matching the name on the dto
        let roleId = (await client.query('SELECT * FROM ers.roles WHERE role = $1', [newUser.role])).rows[0].roleId
        // send an insert that uses the id above and the user input
        let result = await client.query('INSERT INTO ers.users (username, "password", email, firstName, lastName, "role") values ($1,$2,$3,$4,$5,$6) RETURNING userId;',
        [newUser.username, newUser.password, newUser.email, newUser.firstName, newUser.lastName, roleId])
        // put that newly genertaed user_id on the DTO 
        newUser.userId = result.rows[0].userId
        return userDTOToUserConverter(newUser)// convert and send back
    } catch(e){

        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindUserById(id:number):Promise<User>{
    let client:PoolClient
    console.log("connection complete");
    try{
        console.log("connection complete");
        client = await connectionPool.connect()
        console.log("connection complete");
        
        let result = await client.query('SELECT * FROM ers.users U inner join ers.roles R on U."roleId" = R."roleId" WHERE U."userId" = $1', [id])
        if(result.rowCount === 0){
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(result.rows[0])

    }catch(e){
        // id DNE
        //need if for that
        if(e.message ==='User Not Found'){
            throw new UserNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

export async function daoUpdateUser(updates:object[],id:number):Promise<User>{
let client:PoolClient
try{
    client = await connectionPool.connect()
    let updateUsername:boolean = false;
    let newUsername:string = ''
    let updatePassword:boolean = false;
    let newPassword:string = ''
    let updateFirstName:boolean = false;
    let newFirstName:string = ''
    let updateLastName:boolean = false;
    let newLastName:string = ''
    let updateEmail:boolean = false;
    let newEmail:string = ''
    let updateRole:boolean = false;
    let newRole:number = 0
    for(let i = 0; i < updates.length; i++){
        switch(updates [i][0]){
            case "username":
                updateUsername = true;
                newUsername = updates[i][1]
                break;
            case "password":
                updatePassword = true;
                newPassword = updates[i][1]
                break;
            case "firstName":
                updateFirstName = true;
                newFirstName = updates[i][1]
                break;
            case "lastName":
                updateLastName = true;
                newLastName = updates[i][1]
                console.log("lastName is changing",newLastName)
                break;
            case "email":
                updateLastName = true;
                updateEmail = true;
                newEmail = updates[i][1]
                console.log("email is changing",newLastName)
                break;
            case "role":
                updateRole = true;
                newRole = updates[i][1]
                break;
            case "default":
                break;
        }

        if (updateUsername === true) {
             await client.query('update ers.users set username = $1 where users."userId" = $2',[newUsername, id] )

        }

        if (updatePassword === true) {
            await client.query('update ers.users set "password" = $1 where users."userId" = $2',[newPassword, id] )
            
        }
    
        if (updateFirstName === true) {
            await client.query('update ers.users set "firstName" = $1 where users."userId" = $2',[newFirstName, id] )
            
        }
    
        if (updateLastName === true) {
            await client.query('update ers.users set "lastName"= $1 where users."userId" = $2',[newLastName, id] )
            
        }
    
        if (updateEmail === true) {
            await client.query('update ers.users set email = $1 where users."userId" = $2',[newEmail, id] )
        }

        if (updateRole === true) {
            await client.query('update ers.users set role= $1 where users."userId" = $2',[newRole, id] )
        }
    }

    let user = daoFindUserById(id)
    return user
}catch(e){
    // id DNE
    //need if for that
    if(e.message ==='User Not Found'){
        throw new UserNotFoundError()
    }
    console.log(e)
    throw new InternalServerError()
} finally {
    client && client.release()
}
}
