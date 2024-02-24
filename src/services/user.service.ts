import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {OutputUser} from "../models/users/output/output-user";
import {ObjectId} from "mongodb";

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

    static async updateUsersRefreshToken(userId: string, refreshToken: string) {
        try {
            return await UserRepository.updateRefreshToken(userId, refreshToken)
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