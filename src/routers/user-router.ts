import * as express from 'express'
export const userRouter = express.Router()

import * as bodyparser from 'body-parser'
import { User} from '../models/User'
import { authAdminMiddleware, authUserMiddleware, authFactory, authCheckId } from '../middleware/auth-middleware'
import { findAllUsers, saveOneUser, findUserById, updateUser } from '../services/user-service'
import { UserDTO } from '../dtos/UserDTO'



userRouter.get('',[authFactory(["admin"]), async (req, res)=>{
   
    //get all of our users
  //  res.json(users)
    
    // format them to json 
    let users:User[] = await findAllUsers(); 
    res.json(users)// this will format the object into json and send it back
    // use response object to send them back
   
}])


userRouter.get('/:id',authFactory(["admin","associate"]), async (req, res)=>{

    const id = +req.params.id;
    if(isNaN(id)){
        res.sendStatus(400)
    }else {
        try{
            let user = await findUserById(id)
            res.json(user)
        }catch(e){
            res.status(e.status).send(e.message)
        }
      
        
    }
})


userRouter.patch('',authFactory(["admin"]), async (req, res)=>{
    let updates= []
    let id:number = +req.body.userId
    for (let itemsFromBody in req.body){
        if (itemsFromBody != "userId")
        updates.push([`${itemsFromBody}`,`${req.body[itemsFromBody]}`])
    }
//   console.log(updates)
   let user = await updateUser(updates,id)
   res.json(user)
})

