import {blackListRefreshCollection, usersCollection} from "../db/db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {OutputUser} from "../models/users/output/output-user";

export type MeDataType = {
    email: string
    login: string
    userId: string
}

export class UserRepository {

    static async createUser(data: UserDbType): Promise<string | null> {
        try {

            const result = await usersCollection.insertOne(data)

            return result.insertedId ? result.insertedId.toString() : null

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async confirmEmail(id: string): Promise<boolean> {
        try {

            const result = await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.isConfirmed': true}})

            return !!result.modifiedCount

        } catch (e) {
            console.error(e)

            return false
        }

    }

    static async getUserByConfirmCode(code: string): Promise<WithId<UserDbType> | null> {
        try {

            return await usersCollection.findOne({'emailConfirmation.confirmationCode': code})

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async updateRefreshToken(userId: string, refreshToken: string) {
        try {

            const result = await usersCollection.updateOne({_id: new ObjectId(userId)}, {$set: {refreshToken: refreshToken}})

            return !!result.modifiedCount

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async deleteRefreshToken(userId: string, refreshToken: string): Promise<boolean | null> {
        try {

            await blackListRefreshCollection.insertOne({token: refreshToken})

            return true

        } catch (e) {

            console.error(e)

            return null

        }

    }

    static async updateConfirmationCode(id: string, code: string, newExpirationDate: Date) {
        try {

            const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': newExpirationDate}})

            return result.modifiedCount ? result.modifiedCount : null

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async meData(userId: string): Promise<MeDataType | null> {

        try {
            const result = await usersCollection.findOne({ _id: new ObjectId(userId) })

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

    static async getUserById(id: ObjectId): Promise<OutputUser | null> {
        try {
            const result = await usersCollection.findOne({ _id: id })

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

    static async findUserByEmail(email: string): Promise<WithId<UserDbType> | null> {
        try {

            const result = await usersCollection.findOne({email: email})

            return result ? result : null

        } catch (e) {
            console.error(e)

            return null
        }

    }

    static async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbType> | null> {
        try {
            const result = await usersCollection.findOne({
                $or: [
                    {email: loginOrEmail},
                    {login: loginOrEmail},
                ]
            })

            if (result) {
                return {
                    ...result,
                    _id: result._id
                }
            } else {
                return null
            }

        } catch(e) {
            console.error(e)

            return null
        }
    }

    static async deleteUserById(id: string): Promise<boolean> {
        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)})

            return !!result.deletedCount
        } catch (e) {

            console.error(e)

            return false

        }

    }
}