import {emailAdapter} from "../adapter/email-adapter";

export class EmailManager {
    static async sendEmailConfirmationMassage(email: string, subject: string) {

        const message = '<div><a>Здоров бро! Для завершения регистрации клацай сюды. А хочешь быть атишнегом - бегом в it-incubator!</a></div>'

        await emailAdapter.sendEmail(email, subject, message)
    }
}