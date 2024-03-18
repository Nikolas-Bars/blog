import {CommentsModel, LikesModel} from "../db/db";
import {ObjectId} from "mongodb";
import {WithId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {UpdateWriteOpResult} from "mongoose";
import {LikesDbType, LikeStatus} from "../models/likes/LikesDbType";

export class LikeRepository {

    static async getCommentLikeData(userId: string, commentId: string,) {
        try {

            const like: WithId<LikesDbType> | null = await LikesModel.findOne({commentId: commentId, userId: userId})

            return like ? like : null

        } catch(e) {

            console.error(e)
            return null

        }


    }

    static async getMyStatusForComment(commentId: string, userId: string): Promise<LikeStatus> {
        try {
            const like: LikesDbType | null = await LikesModel.findOne({commentId: commentId, userId: userId})

            if (!like) return 'None'

            return like.status

        } catch (e) {
            console.error(e)
            return 'None'
        }
    }

    static async createLikeStatus(likeStatus: LikeStatus, commentId: string, currentUserId: string): Promise<boolean> {
        try {

            const result = await LikesModel.insertMany([{
                userId: new ObjectId(currentUserId),
                commentId: commentId,
                status: likeStatus
            }])

            return !!result.length

        } catch (e) {
            console.error(e)
            return false
        }
    }

    static async updateLikeStatus(likeStatus: LikeStatus, likeId: string): Promise<boolean> {
        try {
            // worked

                const result: UpdateWriteOpResult = await LikesModel.updateOne({_id: new ObjectId(likeId)}, {$set: {status: likeStatus}})

                return !!result.modifiedCount

        } catch (e) {
            console.error(e)

            return false
        }
    }
}