import {CommentsModel} from "../db/db";
import {SortDirection} from "mongodb";
import {PaginationType} from "../models/common";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {commentMapper} from "../models/comments/mappers/post-mapper";

export type QueryPostDataType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

export class CommentsQueryRepository {

    static async getCommentsForPostById(queryData: QueryPostDataType, postId: string): Promise<PaginationType<CommentOutputType> | null> {

        try {
            // worked
            const {sortDirection, sortBy, pageSize, pageNumber} = queryData

            const filter = { postId: postId }

            let sortOptions: {[key: string]: SortDirection} = {};

            if (sortBy && sortDirection) {
                sortOptions[sortBy] = sortDirection;
            }

            const comments = await CommentsModel
                .find(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort(sortOptions)

            const totalCount = await CommentsModel
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