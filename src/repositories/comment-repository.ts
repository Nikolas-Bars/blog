import {CommentsModel} from "../db/db";
import {ObjectId} from "mongodb";
import {WithId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {UpdateWriteOpResult} from "mongoose";

export class CommentRepository {

    static async createComment(newPost: CommentInputType): Promise<string | null> {
        try {
                // worked
                const result = await CommentsModel.insertMany([
                    {
                        commentatorInfo: newPost.commentatorInfo,
                        content: newPost.content,
                        createdAt: newPost.createdAt,
                        postId: newPost.postId
                    }])

                    return result ? result[0]._id.toString() : null

        } catch (e) {
            return null
        }
    }

    static async updateComment(id: string, content: string): Promise<number | null> {
        try {

            const result: UpdateWriteOpResult = await CommentsModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})

            return result.modifiedCount

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async getCommentById(commentId: string): Promise<CommentOutputType | null> {
        try {
            // worked
            const comment: WithId<CommentInputType> | null = await CommentsModel.findOne({_id: new ObjectId(commentId)})

            if (comment) {
                return {
                    id: comment._id.toString(),
                    commentatorInfo: comment.commentatorInfo,
                    content: comment.content,
                    createdAt: comment.createdAt
                }
            } else {
                return null
            }

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async deleteOneComment(id: string) {
        try {
            // worked
            const result: any = await CommentsModel.deleteOne({ _id: new ObjectId(id) })

            if (!result) {
                return null
            }
            return result.deletedCount
        } catch (e) {
            console.error(e)
        }
    }

}