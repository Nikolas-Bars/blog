import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string): Promise<string | null> {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'docum.magic0@gmail.com',
                pass: 'uybtwkdqvbetsvmm'
            }
        })

        let info = await transport.sendMail({
            from: 'Nikolas Bars <docum.magic0@gmail.com>',
            to: email,
            subject,
            html: message
        })

        return info ? info.messageId : null
    }
}