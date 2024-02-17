import {usersCollection} from "../db/db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {OutputUser} from "../models/users/output/output-user";

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

    static async updateConfirmationCode(id: string, code: string) {
        try {

            const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, {$set: {'emailConfirmation.confirmationCode': code}})

            return result.modifiedCount ? result.modifiedCount : null

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