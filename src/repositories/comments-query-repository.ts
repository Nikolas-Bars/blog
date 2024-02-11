import {commentsCollection, postsCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId, SortDirection} from "mongodb";
import {PaginationType} from "../models/common";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {commentMapper} from "../models/comments/mappers/post-mapper";

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

export class CommentsQueryRepository {

    static async getCommentsForPostById(queryData: QueryPostDataType, postId: string): Promise<PaginationType<CommentOutputType> | null> {

        try {

            const {sortDirection, sortBy, pageSize, pageNumber} = queryData

            const filter = { postId: postId }

            const comments = await commentsCollection
                .find(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort(sortBy, sortDirection)
                .toArray()

            const totalCount = await commentsCollection
                .countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / pageSize)

            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: comments.map((comment) => {
                    return commentMapper(comment)
                })
            }


        } catch (e) {
            return null
        }

    }
}