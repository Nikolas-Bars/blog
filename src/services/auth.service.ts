import bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {UserRepository} from "../repositories/user-repository";
import {JWTService} from "./JWT.service";

export class AuthService {
    static async _checkPassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash)
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