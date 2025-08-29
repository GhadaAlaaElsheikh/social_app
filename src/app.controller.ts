 import {resolve} from 'node:path'
 import {config} from "dotenv"
 config({path: resolve("./config/.env.development")})
 import  type  { Request,  Express, Response} from 'express'
 import express from 'express';
import cors from 'cors'
import helmet from 'helmet'
import {rateLimit} from 'express-rate-limit'
 import authController from './modules/auth/auth.controller'
import userController from './modules/user/user.controller'
 import { globalErrorHandling } from './utils/response/error.response';
import { connectDB } from './DB/db.connection';
 

 
 const bootstrap = async(): Promise<void> =>{
  const port: string | number = process.env.PORT || 5000
    const app:Express = express();

  app.use(cors())
  app.use(helmet())
  const limiter = rateLimit({
    windowMs: 60 * 60000,
    limit :2000,
    message:{error:"too many request please try again"},
    statusCode:429,
  });
  app.use(limiter)

  app.get("/",(req:Request,res:Response)=>{
    res.json({message:`welcome ${process.env.APPLICATION_NAME}`})
  })
  app.use("/auth",authController)
  app.use("/user", userController)
   

  app.use(globalErrorHandling)
  await connectDB()
  
  app.listen(port,()=>{
    console.log(`server is running on port :: ${port}`);
    
  })
}

  export default bootstrap;