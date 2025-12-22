import {UsersModel} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {OutputUser} from "../models/users/output/output-user";
import {UpdateWriteOpResult} from "mongoose";

export type MeDataType = {
    email: string
    login: string
    userId: string
}

type DeleteResult = {
    deletedCount: any
}

export class UserRepositoryClass {

    async createUser(data: UserDbType): Promise<string | null> {
        try {
            // worked

            const result = await UsersModel.insertMany([data])

            return result.length ? result[0]._id.toString() : null

        } catch (e) {

            console.error(e)

            return null

        }
    }

    async confirmEmail(id: string): Promise<boolean> {
        try {
            // worked
            const result: UpdateWriteOpResult = await UsersModel.updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.isConfirmed': true}})

            return !!result.modifiedCount

        } catch (e) {
            console.error(e)

            return false
        }

    }

    async updatePassword(userId: string, password: string): Promise<boolean> {
        try {
            // worked
            const result: UpdateWriteOpResult = await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {password: password}})

            return !!result.modifiedCount

        } catch (e) {
            console.error(e)

            return false
        }

    }

    async getUserByConfirmCode(code: string): Promise<WithId<UserDbType> | null> {
        try {
            // worked
            return await UsersModel.findOne({'emailConfirmation.confirmationCode': code})

        } catch (e) {

            console.error(e)

            return null

        }
    }

    async getUserByRecoveryCode(code: string): Promise<WithId<UserDbType> | null> {
        try {
            // worked
            return await UsersModel.findOne({'emailConfirmation.recoveryCode': code})

        } catch (e) {

            console.error(e)

            return null

        }
    }

    async updateConfirmationCode(id: string, code: string, newExpirationDate: Date) {
        try {
            // worked
            const result: UpdateWriteOpResult = await UsersModel.updateOne({ _id: new ObjectId(id) }, {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': newExpirationDate}})

            return result.modifiedCount ? result.modifiedCount : null

        } catch (e) {
            console.error(e)

            return null
        }
    }

    async updateRecoveryCode(userId: string, code: string, newExpirationDate: Date) {
        try {
            // worked
            const result: UpdateWriteOpResult = await UsersModel.updateOne({ _id: new ObjectId(userId) }, {$set: {'emailConfirmation.recoveryCode': code, 'emailConfirmation.expirationRecoveryDate': newExpirationDate}})

            return result.modifiedCount ? result.modifiedCount : null

        } catch (e) {
            console.error(e)

            return null
        }
    }

    async meData(userId: string): Promise<MeDataType | null> {

        try {
            // worked
            const result: UserDbType | null = await UsersModel.findOne({ _id: new ObjectId(userId) })

            if(!result) return null

            return {
                email: result.email,
                login: result.login,
                userId: userId
            }

        } catch (e) {

            console.error(e)

            return null

        }
    }

    async getUserById(id: ObjectId): Promise<OutputUser | null> {
        // worked
        try {
            const result: WithId<UserDbType> | null = await UsersModel.findOne({ _id: id })

            let user;

            if (result) {
                user = {
                    createdAt: result.createdAt,
                    email: result.email,
                    id: result._id.toString(),
                    login: result.login
                }
            } else {
                return null
            }

            return user

        } catch (e) {

            console.error(e)

            return null

        }

    }

    async findUserByEmail(email: string): Promise<WithId<UserDbType> | null> {
        try {
            // worked
            const result = await UsersModel.findOne({email: email})

            return result ? result : null

        } catch (e) {
            console.error(e)

            return null
        }

    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbType> | null> {
        // worked
        try {
            const result = await UsersModel.findOne({
                $or: [
                    {email: loginOrEmail},
                    {login: loginOrEmail},
                ]
            })
            if (result) {
                return result
            } else {
                return null
            }

        } catch(e) {
            console.error(e)

            return null
        }
    }

    async deleteUserById(id: string): Promise<boolean> {
        // worked
        try {
            const result: DeleteResult = await UsersModel.deleteOne({_id: new ObjectId(id)})

            return !!result.deletedCount
        } catch (e) {

            console.error(e)

            return false

        }

    }
}

export const UserRepository = new UserRepositoryClass()