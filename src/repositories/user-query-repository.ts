import {postsCollection, usersCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {PaginationType, ResponseType} from "../models/common";
import {QueryUserInputModel} from "../models/users/input/query.user.input.model";
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

export class UserQueryRepository {

    static async getUsers(params: QueryUserInputModel): Promise<PaginationType<OutputUser> | null> {
        try {
            const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = params

            let filter = {};

            const correctParams = {
                pageNumber: pageNumber ? +pageNumber : 1,
                pageSize: pageSize ? +pageSize : 10,
                sortBy: sortBy ?? 'createdAt',
                sortDirection: sortDirection ?? 'desc',
                searchEmailTerm: searchEmailTerm ?? null,
                searchLoginTerm: searchLoginTerm ?? null
            }

            if (searchLoginTerm && searchEmailTerm) {
                filter = {
                    $or: [
                        {login: { $regex: searchLoginTerm, $options: 'i' }},
                        {email: { $regex: searchEmailTerm, $options: 'i' }},
                    ]
                }
            } else {
                if(searchLoginTerm) filter = {login: { $regex: searchLoginTerm, $options: 'i' }}
                if(searchEmailTerm) filter = {email: { $regex: searchEmailTerm, $options: 'i' }}
            }

            const totalCount = await usersCollection
                .countDocuments(filter)

            const users = await usersCollection
                .find(filter)
                .skip((correctParams.pageNumber - 1) * correctParams.pageSize)
                .limit(correctParams.pageSize)
                .sort(correctParams.sortBy, correctParams.sortDirection)
                .toArray()

            return {
                page: correctParams.pageNumber,
                pagesCount: Math.ceil(totalCount / correctParams.pageSize),
                pageSize: correctParams.pageSize,
                totalCount: totalCount,
                items: users.map((user) => {
                    return this._mapResult(user)
                })
            }
        } catch (e) {
            console.error(e)

            return null
        }
    }

    static _mapResult(users: WithId<UserDbType>): OutputUser {
        return {
            id: users._id.toString(),
            createdAt: users.createdAt,
            email: users.email,
            login: users.login
        }
    }
}