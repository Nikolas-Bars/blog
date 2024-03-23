import bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {UserRepository} from "../repositories/user-repository";
import {JWTService} from "./JWT.service";
import {RegistrationDataType} from "../models/auth/input/input-auth-model";
import {v1} from "uuid";
import add from "date-fns/add"
import {EmailManager} from "../manager/email-manager";
import {SessionServices} from "./session.service";
import {SecurityDbType} from "../models/securityDevices/securityDbType";
import {SecurityDevicesRepository} from "../repositories/security-devices-repository";
import {UserService} from "../composition-root";


export class AuthService {
    static async _checkPassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash)
    }

    static async confirmEmail(code: string) {
        try {

            const user = await UserRepository.getUserByConfirmCode(code)

            if (user && user.emailConfirmation && user.emailConfirmation.expirationDate > new Date() && !user.emailConfirmation.isConfirmed) {

                const result = await UserRepository.confirmEmail(user._id.toString())

                return result ? result : null

            } else {
                return null
            }

        } catch (e) {
            console.error(e)

            return null
        }

    }

    static async checkRecoveryCode(code: string, password: string) {

        try {

            const user = await UserRepository.getUserByRecoveryCode(code)

            if (user && user.emailConfirmation && user.emailConfirmation.expirationRecoveryDate > new Date()) {

                // создаем хэш пароля
                const salt = await bcrypt.genSalt(10)

                const passwordHash = await UserService._generateHash(password, salt)

                const result = await UserRepository.updatePassword(user._id.toString(), passwordHash)

                return result ? result : null

            } else {
                return null
            }

        } catch (e) {
            console.error(e)

            return null
        }

    }

    static async resendConfirmationCode(email: string): Promise<string | null> {

        const user: WithId<UserDbType> | null = await UserRepository.findUserByEmail(email)

        if (user && user.emailConfirmation) {

            const newCode = v1()

            const newExpirationDate = add.add(new Date(), {
                hours: 1,
                minutes: 30
            })

            await UserRepository.updateConfirmationCode(user._id.toString(), newCode, newExpirationDate)

            const isConfirmed = user.emailConfirmation.isConfirmed

            if (isConfirmed) return null // если email уже подтвержден
            // если не подтвержден - отправляем письмо заново

            return await EmailManager.sendEmailConfirmationMassage(user.email, 'Resending code', newCode)

        } else {
            return null
        }
    }

    static async getMeData(userId: string) {
        try {

            return await UserRepository.meData(userId)

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async registerUser(data: RegistrationDataType) {

        let result = null

        const {login, email, password} = data
        // проверяем существует ли пользователь
        const user = await UserRepository.findByLoginOrEmail(data.login) as WithId<UserDbType>
        if (user) return null
        // создаем хэш пароля
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await UserService._generateHash(password, salt)

        const newUser = {
            email: data.email,
            login: data.login,
            password: passwordHash,
            salt: salt,
            createdAt: (new Date).toISOString(),
            emailConfirmation: {
                // confirmationCode - код который уйдет пользователю
                confirmationCode: v1(),
                // expirationDate - дата когда код устареет
                expirationDate: add.add(new Date(), {
                    hours: 1,
                    minutes: 30
                }),
                isConfirmed: false
            }
        }
        // записываем нового пользователя в базу и получаем его id
        const createdId = await UserRepository.createUser(newUser as UserDbType)
        if (createdId) {
            // отправляем email на почту с кодом подтверждения
            result = await EmailManager.sendEmailConfirmationMassage(newUser.email, 'Registration new user', newUser.emailConfirmation.confirmationCode)
        }

        return result ? result : null

    }

    static async sendRecoveryCode(email: string, userId: string) {

        try {

            const recoveryCode = v1()

            const result = await EmailManager.sendRecoveryMail(email, 'Recovery code', recoveryCode)

            if (!result) return null

            const exp = add.add(new Date(), {
                minutes: 3
            })

            await UserRepository.updateRecoveryCode(userId, recoveryCode, exp)

            return result

        } catch (e) {

            console.error(e)

            return null

        }


    }

    static async login(loginOrEmail: string, password: string, deviceName: string, ip?: string): Promise<{ accessToken:string, refreshToken: string } | null> {
        try {
            const user = await UserRepository.findByLoginOrEmail(loginOrEmail) as WithId<UserDbType>

            // если пользователь не найден или у него нет подтверждения почты
            if (!user || (user.emailConfirmation && !user.emailConfirmation.isConfirmed)) {
                return null
            }

            const isPasswordCorrect = await this._checkPassword(password, user.password)

            if (!isPasswordCorrect) return null

            const deviceId = v1()

            const accessToken = await JWTService.createToken(user._id.toString())

            const refreshToken = await JWTService.createRefreshToken(user._id.toString(), deviceId)

            const decoded: any = await JWTService.decodeToken(refreshToken)

            const session: SecurityDbType = {
                userId: user._id.toString(),
                issueAt: decoded.iat,
                deviceId,
                ip,
                title: deviceName,
                lastActiveDate: new Date().toISOString()
            }

            await SessionServices.CreateSession(session)

            return { accessToken, refreshToken }

        } catch (e) {

            console.error(e)

            return null

        }


    }

    static async updateTokens(user_id: string, deviceId: string): Promise<{ accessToken:string, refreshToken: string } | null> {

        try {

            const accessToken = await JWTService.createToken(user_id)

            const refreshToken = await JWTService.createRefreshToken(user_id, deviceId)

            const decodedRefresh: any = await JWTService.decodeToken(refreshToken)

            await SecurityDevicesRepository.updateSession(deviceId, decodedRefresh.iat)

            return { accessToken , refreshToken }

        }  catch (e) {

            console.error(e)

            return null

        }

    }

    static async checkAccessToken(token: string, refreshToken: string) {
        try {

            const accessPayload = await JWTService.verifyToken(token)

            const refreshPayload = await JWTService.verifyToken(refreshToken)

            if (!accessPayload) return null

            if (Date.now() > accessPayload.exp * 1000 && Date.now() <= refreshPayload.exp * 1000) {

            } else if (Date.now() < accessPayload.exp) {
                return accessPayload
            }

        } catch (e) {

            console.error(e)

            return null

        }
    }
}