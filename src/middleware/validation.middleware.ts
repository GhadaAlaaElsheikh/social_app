import type { NextFunction, Request, Response } from "express";
 import {z} from 'zod'
import {ZodError, ZodType} from 'zod'

 
type keyReqType = keyof Request;
type schemaType =Partial<Record<keyReqType, ZodType>>

export const validation =(schema:schemaType)=>{
  return(
    req:Request,
     res:Response,
      next:NextFunction):Response| NextFunction =>{
    console.log(Object.keys(schema));
    const errors :{
      key:keyReqType , 
      issues:{
        path:string| number|symbol|undefined;
        message:string;
      }[];
    }[]=[]
  /*  const errors :Array<{
      key:keyReqType,
      issues:Array<{
          path:string| number|symbol|undefined;
        message:string;
      }>;
    }>=[];*/

    for (const key of Object.keys(schema)as keyReqType[]) {
     if (!schema[key]) continue;
      
      const validationResult = schema[key].safeParse(req[key])
      
      if (!validationResult.success) {
        const error = validationResult.error as ZodError
          errors.push({key, 
            issues:error.issues.map(err =>{
              return {path: err.path[0], message: err.message}
            })
            
          })
        }
        
      }
      if (errors.length) {
        return res.status(400).json({message:"validation error",errors})
      }
    
    return next()as unknown as NextFunction;
  }
}

export const generalFields ={
  username:z.string({error:"username is required"})
      .min(2,{error:"min is :2"}).
      max(20),
        email: z.email(),
    password: z.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: z.string(),
    otp:z.string().regex(/^\d{6}$/),
  
}