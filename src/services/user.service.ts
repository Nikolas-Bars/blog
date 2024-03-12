import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {OutputUser} from "../models/users/output/output-user";
import {ObjectId} from "mongodb";
import {SessionServices} from "./session.service";
import {UserDbType} from "../models/users/db/user-db";

export class UserService {

    static async createUser(data: CreateUserInputModel): Promise<OutputUser | null> {

        const salt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(data.password, salt)

        const newUserData = {
            email: data.email,
            login: data.login,
            password: passwordHash,
            salt: salt,
            createdAt: (new Date).toISOString(),
            emailConfirmation: {
                isConfirmed: true
            }
        }

        const newUserId: string | null = await UserRepository.createUser(newUserData as UserDbType)

        if (newUserId) {
            const user: OutputUser | null = await UserRepository.getUserById(new ObjectId(newUserId))

            return user ? user : null
        } else {
            return null
        }
    }

    static async deleteRefreshTokenByUserId(userId: string, deviceId: string, refreshToken: string) {
        try {

            // теперь удаляем только сессию так как ни black листа ни отдельной таблицы под RefreshToken нет
            return await SessionServices.deleteOneSessions(deviceId)

            // return await UserRepository.deleteRefreshToken(userId, refreshToken)

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async doesExistsById(id: string): Promise<boolean> {

        const user = await UserRepository.getUserById(new ObjectId(id))

        return !!user
    }
    static async _generateHash(password: string, salt: string) {

        return await bcrypt.hash(password, salt)

    }

    static async deleteUser(id: string): Promise<boolean> {

        return await UserRepository.deleteUserById(id)

    }
}