import {PostsModel} from "../db/db";
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
            // worked
            const {sortDirection, sortBy, pageSize, pageNumber} = queryData

            const filter = {}

            let sortOptions: {[key: string]: SortDirection} = {};

            if (sortBy && sortDirection) {
                sortOptions[sortBy] = sortDirection;
            }

            const posts = await PostsModel
                .find(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort(sortOptions)

            const totalCount = await PostsModel
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

            const post = await PostsModel.findOne({_id: new ObjectId(postId)})

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

            const result: any = await PostsModel.deleteOne({_id: new ObjectId(postId)})

            return !!result.deletedCount

        } catch (e) {
            return false
        }

    }
}