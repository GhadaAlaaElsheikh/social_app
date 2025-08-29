import {strictObject, z} from 'zod';
import { generalFields } from '../../middleware/validation.middleware';


export const login ={

   
  body:z.strictObject({
     username : generalFields.username,
    email: generalFields.email,
    password: generalFields.password
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: generalFields.confirmPassword,
  })
      
    }
    
export const signup ={

   
  body:login.body.extend({
     username : generalFields.username,
    email: generalFields.email,
    password: generalFields.password
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    confirmPassword: generalFields.confirmPassword,
  })
  .superRefine((data, ctx)=>{
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code:"custom",
        message:"password mismatch confirmPassword",
        path:["confirmPassword"]
      })
      
    }
    if (data.username.split(" ").length !=2) {
      ctx.addIssue({
        code:"custom",
        message:"in-valid username musst consist of 2 part like JON DOE",
        path:['username']
      })
      
    }
  })
  //refine(data=>{
  //  return data.password === data.confirmPassword
  //},{
  //  error:"password mismatch confirm password"
//  }
//)
}

export const confirmEmail ={

  body:strictObject({
     
    email: generalFields.email,
   otp: generalFields.otp
  })
 
 
 
}