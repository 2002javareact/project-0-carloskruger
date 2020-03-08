import { Request, Response } from "express";


export function corsFilter(req:Request,res:Response,next){
   // res.header('Access-Control-Allow-Origin', `${req.headers.origin}`)//this is a hack, never do it in a real application
   // res.header('Access-Control-Allow-Origin', "http://localhost:3000")
    res.header('Access-Control-Allow-Origin', "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
   
    if(req.method === 'OPTIONS'){
        //this is where we send the 'Pre Flight Response    
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.sendStatus(200)
    }else{
        res.header('Access-Control-Allow-Origin', '*');
        next()
    }

}