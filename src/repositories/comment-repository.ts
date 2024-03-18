import {CommentsModel, LikesModel} from "../db/db";
import {ObjectId} from "mongodb";
import {WithId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {UpdateWriteOpResult} from "mongoose";
import {LikeStatus} from "../models/likes/LikesDbType";

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

    // static async updateLikeStatus(commentId: string, currentUserId: string, likeStatus: LikeStatus): Promise<number | null> {
    //     try {
    //
    //         const result: UpdateWriteOpResult = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}})
    //
    //         return result.modifiedCount
    //
    //     } catch (e) {
    //         console.error(e)
    //
    //         return null
    //     }
    // }

    static async updateLikeStatus(userId: string, commentId: string, likeStatus: LikeStatus): Promise<boolean> {
        try {
            // worked
            const like: WithId<CommentInputType> | null = await LikesModel.findOne({commentId: commentId, userId: userId})

            if (like) {
                await LikesModel.updateOne({_id: like._id}, {$set: {status: likeStatus}})
            } else {
                await LikesModel.insertMany([{
                    userId: userId,
                    commentId: commentId,
                    status: likeStatus
                }])
            }

            return true

        } catch (e) {
            console.error(e)

            return false
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