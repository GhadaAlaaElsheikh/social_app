/*export interface ISignupBodyInputs{
  username:string, email: string, password:string, phone:string  
 
}
  */
import * as validators from '../auth.validation'
import {z} from 'zod'
export type ISignupBodyInputsDTto = z.infer<typeof validators.signup.body>
export type IConfirmEmailBodyInputsDTto = z.infer<typeof validators.confirmEmail.body>
export type ILoginBodyInputDTto = z.infer<typeof validators.login.body>