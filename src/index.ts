import * as express from 'express'
import * as bodyparser from 'body-parser'
import { User } from './models/User'
import { loggingMiddleware } from './middleware/logging-middleware'

import { sessionMiddleware } from './middleware/session-middleware'
import {userRouter} from './routers/user-router'
import {reimburseRouter} from './routers/reimbursement-router'
import { HttpError } from './errors/HttpError'
import { BadCredentialsError } from './errors/BadCredentialsError'
import { findUserByUsernameAndPassword} from './services/user-service'
import { corsFilter } from './middleware/cors-filter'


const app = express()

app.use('/', bodyparser.json())

app.use(loggingMiddleware)

app.use(sessionMiddleware)

app.use(corsFilter)

app.post('/login', async (req,res)=>{
    //step one, get data from user
    const {username, password} = req.body
    //step two, validate that data
    if(!username || !password){
        res.status(400).send('Invalid Credentials')
    } else {
        try {
            let user = await findUserByUsernameAndPassword(username,password)
            req.session.user = user
            res.status(200).json(user)// we do this for ourselves, when we start working on front end
        } catch(e){
            res.status(e.status).send(e.message)
        }
    }
})



app.use('/users',userRouter)



app.use('/reimbursements',reimburseRouter)



app.use('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(1980, () => {
    console.log('app has started on port 1980')})