import {postsCollection, usersCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {PaginationType, ResponseType} from "../models/common";
import {QueryUserInputModel} from "../models/users/input/query.user.input.model";
import {UserDbType} from "../models/users/db/user-db";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
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

    static async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
        try {
            return  await usersCollection.findOne({
                $or: [
                    {email: loginOrEmail},
                    {login: loginOrEmail},
                ]
            })
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