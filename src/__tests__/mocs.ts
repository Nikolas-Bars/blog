export const emailServiceMock = {
    async sendEmail(email: string, subject: string, message: string) {
        try {
            return 'message number'
        } catch (e) {
            return null
        }

    }
}