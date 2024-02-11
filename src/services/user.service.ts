import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {OutputUser} from "../models/users/output/output-user";
import {ObjectId} from "mongodb";
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
            createdAt: (new Date).toISOString()
        }

        const newUserId: string | null = await UserRepository.createUser(newUserData)

        if (newUserId) {
            const user: OutputUser | null = await UserRepository.getUserById(new ObjectId(newUserId))

            return user ? user : null
        } else {
            return null
        }
    }

    static async deleteUser(id: string): Promise<boolean> {

        return await UserRepository.deleteUserById(id)

    }

    static async _generateHash(password: string, salt: string) {

        return await bcrypt.hash(password, salt)

    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {

        const user: UserDbType | null = await UserRepository.findByLoginOrEmail(loginOrEmail)

        if (!user) {
            return false
        }

        const passwordHash = await this._generateHash(password, user.salt)

        return passwordHash === user.password;

    }
}