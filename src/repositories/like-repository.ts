import {CommentsModel, LikesModel, LikesPostModel} from "../db/db";
import {ObjectId} from "mongodb";
import {WithId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {UpdateWriteOpResult} from "mongoose";
import {LikesDbType, LikesPostDbType, LikeStatus} from "../models/likes/LikesDbType";
import {NewestLikesType} from "../models/posts/output/output-post";

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
/////////////////////////////////////////////////////////////////////////////
    static async getPostLikeDataOfPost(userId: string, postId: string,) {
        try {

            const like: WithId<LikesPostDbType> | null = await LikesPostModel.findOne({postId: postId, userId: userId})

            return like ? like : null

        } catch(e) {

            console.error(e)
            return null

        }
    }

    static async getLatest3LikesOfPost(postId: string): Promise<LikesPostDbType[] | null> {
        try {
            const likes = await LikesPostModel.find({ postId, status: "Like" })
                .sort({ updated: -1 }) // Сортируем по дате обновления в обратном порядке
                .limit(3); // Получаем только три последних лайка

            return likes ? likes : null

        } catch(e) {

            console.error(e)
            return null

        }
    }

    static async createLikeStatusOfPost(likeStatus: LikeStatus, postId: string, currentUserId: string, login: string): Promise<boolean> {
        try {

            const result = await LikesPostModel.insertMany([{
                userId: new ObjectId(currentUserId),
                postId: postId,
                login: login,
                status: likeStatus,
                updated: new Date().toISOString()
            }])

            return !!result.length

        } catch (e) {
            console.error(e)
            return false
        }
    }

    static async updateLikeStatusOfPost(likeStatus: LikeStatus, likeId: string): Promise<boolean> {
        try {
            // worked

            const result: UpdateWriteOpResult = await LikesPostModel.updateOne({_id: new ObjectId(likeId)}, {$set: {
                status: likeStatus,
                updated: new Date().toISOString()
            }})

            return !!result.modifiedCount

        } catch (e) {
            console.error(e)

            return false
        }
    }
}