import * as express from 'express'
import { authAdminMiddleware, authUserMiddleware, authFactory, authCheckId } from '../middleware/auth-middleware'
import * as bodyparser from 'body-parser'
import { Reimbursement} from '../models/Reimbursement'
import { findReimbursementByStatus, findReimbursementsByUser, submitReimbursement,updateReimbursement } from '../services/reimbursement-service'
import { ReimbursementDTO } from '../dtos/ReimbursementDTO'

export const reimburseRouter = express.Router()
// every single opath starts with /reimbursements
reimburseRouter.post('',authFactory(['finance-manager','admin']), async (req,res)=>{

    let {
        reimbursementId,
        author, 
        amount, 
        description,
        dateSubmitted,
        dateResolved,
        resolver, 
        status, 
        type } = req.body// this will be where the data the sent me is
 //       console.log("req.body.reimbursementId",req.body.reimbursementId)
  //      console.log("reimbursementId",reimbursementId)
        if (author && amount && description && dateSubmitted && dateResolved && resolver && status && type){
 //       if(author && amount && description && dateSubmitted && dateResolved && resolver && status && type){
            let newReimbursement = await submitReimbursement(new ReimbursementDTO(reimbursementId,author,amount,description,dateSubmitted,dateResolved,resolver,status,type))
            
            res.sendStatus(201)// if I don't need to seend a body
        } else {
            console.log(req.body)
            res.status(400).send('Please include all reimbursement fields')
            // for setting a status and a body
        }
    
})

reimburseRouter.patch('',authFactory(["finance-manager","admin"]), async (req, res)=>{
    let updates= []
    let id:number = +req.body.reimbursementId
    for (let itemsFromBody in req.body){
        if (itemsFromBody != "reimbursementId")
        updates.push([`${itemsFromBody}`,`${req.body[itemsFromBody]}`])
    }
   console.log(updates)
   let reimbursement = await updateReimbursement(updates,id)
   res.json(reimbursement)
})



reimburseRouter.get('/status/:statusId',authFactory(['finance-manager','admin']), async(req,res)=>{
    const id = +req.params.statusId
    if(isNaN(id)){
        res.sendStatus(400)
    } else {
        try {
        let reimbursement = await findReimbursementByStatus(id)
        res.json(reimbursement)
    }catch(e){
        res.status(e.status).send(e.message)
    }
  
    
}
})

reimburseRouter.get('/author/userId/:userId',authFactory(['finance-manager','admin']), async(req,res)=>{
    const id = +req.params.userId;
    if(isNaN(id)){
        res.sendStatus(400)
    } else {
        try{
        let reimbursement = await findReimbursementsByUser(id)
        res.json(reimbursement)
    }
    catch(e){
        res.status(e.status).send(e.message)
    }
  
    
}
})





