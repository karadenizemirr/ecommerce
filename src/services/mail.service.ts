import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';



@Injectable()
export class MailService {

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth : {
        user: 'karadenizemirr@gmail.com ',
        pass: 'sansar.75'
      }
    })
  }

  async sendEmail(email:string, subject:string, text:string): Promise<void>{

    const mailOptions = {
      from : 'karadenizemirr@gmail.com',
      to: email,
      subject: subject,
      text: text
    }

    await this.transporter.sendMail(mailOptions)
  }


}