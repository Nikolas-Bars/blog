import {emailAdapter} from "../adapter/email-adapter";

export class EmailManager {
    static async sendEmailConfirmationMassage(email: string, subject: string, code: string) {

        const message = ` <h1>Thank for your registration</h1><a href=\'https://blog-t57v.onrender.com/confirm-email?code=${code}\'>complete registration</a>`

        const result: string | null = await emailAdapter.sendEmail(email, subject, message)

        return result
    }
}