import type {  Request, Response } from "express"
import { IConfirmEmailBodyInputsDTto, ILoginBodyInputDTto, ISignupBodyInputsDTto } from "./dto/auth.dto"; 
import { UserModel } from "../../DB/model/User.model";
import { UserRepository } from "../../DB/repository/user.repositort";
import { BadRequest, conflictException, NotFoundException } from "../../utils/response/error.response";
import { compareHash, generateHash } from "../../utils/security/hash.security";
import { emailEvent } from "../../utils/event/email.event";
import { generateNumberOtp } from "../../utils/otp";
import { createLoginCredentials } from "../../utils/security/token.security";
 
 
class AuthenticationService {
   private userModel = new UserRepository(UserModel);
   constructor(){}
  /** 
   * 
   * @param req - Express.Request
   * @param res - Express.Response
   * @returns Promise<Response>
   * @example({username, email, password}: ISignupBodyInputsDTto)
   * return {message:"done", statusCode:201}
  */

  signup = async(req:Request , res: Response):Promise <Response> =>{
    let {username, email, password} : ISignupBodyInputsDTto= req.body;
    console.log({username, email, password});
       const checkUser = await this.userModel.findOne({
        filter: {email},
        select: "email",
        options:{
          lean:true,
          //populate: [{path :"username"}]
        }
       });
     
       if (checkUser) {
        throw new conflictException("email exists")
       }
       const otp = generateNumberOtp()
     const user = await this.userModel.createUser({
      data : [{
        username,
         email , 
password: await generateHash(password),
confirmEmailOtp:await generateHash(String(otp)),
}],
       
     });

   emailEvent.emit("confirmEmail",{
    to:email,
    otp 
   })
    return res.status(201).json({message:"done", data:{user}})
  };

confirmEmail= async(req:Request , res: Response):Promise<Response>=> {
     const {email, otp} :IConfirmEmailBodyInputsDTto=req.body;

     const user = await this.userModel.findOne({
      filter:{
        email,
         confirmEmailOtp:{$exists:true},
         confirmedAt:{$exists:false}
        }
     })
     if (!user) {
      throw new NotFoundException ("invalid account")
     }

     if (!await compareHash(otp,user.confirmEmailOtp as string)) {
      throw new conflictException("invalid confirmation code")
     }
     await this.userModel.updateOne({
      filter:{email},
      update:{
        confirmedAt: new Date(),
        $unset: {confirmEmailOtp: 1}
      }
     })
    return res.status(200).json({message:"done", data: req.body})
  }

login=async(req:Request , res: Response):Promise<Response>=> {
 const {email,password} : ILoginBodyInputDTto = req.body;
 const user = await this.userModel.findOne({
  filter :{email}
 })
 if (!user) {
  throw new NotFoundException("invalid login data")
 }
 if (!user.confirmedAt) {
  throw new BadRequest("verify your account first")
 }
 if (!(await compareHash(password, user.password))) {
  throw new NotFoundException("invalid login")
 }
  const credentials = await createLoginCredentials(user)
  return res.json({
    message:"done",
    data:{credentials}
  })
};
}
export default new AuthenticationService()