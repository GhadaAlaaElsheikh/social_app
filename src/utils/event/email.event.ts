import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "../email/send.email";
import { verifyEmail } from "../email/verify.template.email";
export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail",
  async(data: Mail.Options)=>{

    try {
      data.subject ="confirm-email"
      data.html=verifyEmail({otp:4422,title:"confirm email"})
      await sendEmail(data)
    } catch (error) {
      console.log(`fail confirm email ${error} `);
      
    }
  }
)