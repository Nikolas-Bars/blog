import {usersCollection} from "../db/db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {OutputUser} from "../models/users/output/output-user";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type QueryPostDataType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

export class UserRepository {

    static async createUser(data: UserDbType): Promise<string | null> {
        try {

            const result = await usersCollection.insertOne({ login: data.login, email: data.email, createdAt: data.createdAt, password: data.password, salt: data.salt })

            return result.insertedId ? result.insertedId.toString() : null

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async getUserById(id: ObjectId): Promise<OutputUser | null> {
        try {
            console.log(id, 'for result')
            const result = await usersCollection.findOne({ _id: id })

            let user;
            console.log(result, '123result')
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
            console.log(user, '1234user')
            return user

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