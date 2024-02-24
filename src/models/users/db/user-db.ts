export type UserDbType = {
    email: string
    login: string
    createdAt: string
    password: string
    refreshToken?: string
    salt?: string
    emailConfirmation?: {
        // confirmationCode - код который уйдет пользователю
        confirmationCode: string
        // expirationDate - дата когда код устареет
        expirationDate: Date
        isConfirmed: boolean
    }
}