import {postsCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId, SortDirection} from "mongodb";
import {PaginationType} from "../models/common";

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

export class PostQueryRepository {

    static async getAll(queryData: QueryPostDataType): Promise<PaginationType<OutputPostModel> | null> {

        try {

            const {sortDirection, sortBy, pageSize, pageNumber} = queryData

            const filter = {}

            const posts = await postsCollection
                .find(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort(sortBy, sortDirection)
                .toArray()

            const totalCount = await postsCollection
                .countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / pageSize)

            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts.map((post) => {
                    return postMapper(post)
                })
            }


        } catch (e) {
            return null
        }

    }

    static async getPostById(postId: string): Promise<OutputPostModel | null> {
        try {

            const post = await postsCollection.findOne({_id: new ObjectId(postId)})

            if(!post) {
                return null
            }

            return postMapper(post)

        }  catch (e) {
            return null
        }
    }

    static async deletePost(postId: string): Promise<boolean> {
        try {

            const result = await postsCollection.deleteOne({_id: new ObjectId(postId)})

            return !!result.deletedCount

        } catch (e) {
            return false
        }

    }
}