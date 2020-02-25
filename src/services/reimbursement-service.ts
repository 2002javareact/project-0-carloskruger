import { daoFindReimbursementByStatus} from "../repositories/reimbursement-dao";
import { daoFindReimbursementsByUser} from "../repositories/reimbursement-dao";
import { daoSubmitReimbursement} from "../repositories/reimbursement-dao";
import { daoUpdateReimbursement} from "../repositories/reimbursement-dao";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTO } from "../dtos/ReimbursementDTO";


export async function findReimbursementByStatus(statusId:number): Promise<Reimbursement[]>{
   
    // keep track of number of login attempts for a username
    // check to see if 5 or more unseccessful in a row
    // time out logins for that user
    return await daoFindReimbursementByStatus(statusId)
 }
 
 export async function findReimbursementsByUser(userId:number): Promise<Reimbursement[]>{
   
    // keep track of number of login attempts for a username
    // check to see if 5 or more unseccessful in a row
    // time out logins for that user
    return await daoFindReimbursementsByUser(userId)
 }
 
 export async function submitReimbursement(newReimbursement:ReimbursementDTO): Promise<Reimbursement>{
   return await daoSubmitReimbursement(newReimbursement)
}

export async function updateReimbursement(updates:object[],id:number):Promise<Reimbursement>{
   return await daoUpdateReimbursement(updates,id)
}
