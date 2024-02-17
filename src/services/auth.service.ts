import bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {UserRepository} from "../repositories/user-repository";
import {JWTService} from "./JWT.service";
import {RegistrationDataType} from "../models/auth/input/input-auth-model";
import {UserService} from "./user.service";
import {v1} from "uuid";
import add from "date-fns/add"
import {EmailManager} from "../manager/email-manager";


export class AuthService {
    static async _checkPassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash)
    }

    static async resendConfirmationCode(email: string): Promise<string | null> {

        const user: WithId<UserDbType> | null = await UserRepository.findUserByEmail(email)

        if (user && user.emailConfirmation) {

            console.log(user.emailConfirmation.confirmationCode, 'old code')

            const newCode = v1()

            await UserRepository.updateConfirmationCode(user._id.toString(), newCode)

            console.log(newCode, 'newCode')

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
            const result = await UserRepository.getUserById(new ObjectId(userId))

            return result
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
        const createdId = await UserRepository.createUser(newUser)
        if (createdId) {
            // отправляем email на почту с кодом подтверждения
            result = await EmailManager.sendEmailConfirmationMassage(newUser.email, 'Registration new user', newUser.emailConfirmation.confirmationCode)
        }

        return result ? result : null

    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<string | false> {
        try {
            const user = await UserRepository.findByLoginOrEmail(loginOrEmail) as WithId<UserDbType>

            if (!user) {
                return false
            }

            const isPasswordCorrect = await this._checkPassword(password, user.password)

            if (!isPasswordCorrect) return false

            return await JWTService.createToken(user._id.toString())

        } catch (e) {

            console.error(e)

            return false

        }


    }
}