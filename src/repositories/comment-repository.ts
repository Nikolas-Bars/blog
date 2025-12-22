import {CommentsModel, LikesModel} from "../db/db";
import {ObjectId} from "mongodb";
import {WithId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {UpdateWriteOpResult} from "mongoose";
import {LikeStatus} from "../models/likes/LikesDbType";
import {LikeRepository} from "./like-repository";

export class CommentRepository {

    static async createComment(newPost: CommentInputType): Promise<string | null> {
        try {
                // worked
                const result = await CommentsModel.insertMany([
                    {
                        commentatorInfo: newPost.commentatorInfo,
                        content: newPost.content,
                        createdAt: newPost.createdAt,
                        postId: newPost.postId,
                        likesInfo: {
                            dislikesCount: 0,
                            likesCount: 0
                        }
                    }])

                    return result ? result[0]._id.toString() : null

        } catch (e) {
            return null
        }
    }

    static async updateLikeCount(commentId: string, likeStatus: LikeStatus, myStatus: LikeStatus | null): Promise<boolean> {
        try {

            let result: UpdateWriteOpResult;

            if (likeStatus === "Like" && myStatus === "Dislike") {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1}})

                return !!result.modifiedCount

            }
            if (likeStatus === "Dislike" && myStatus === "Like") {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.dislikesCount': 1, 'likesInfo.likesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "Like" && (myStatus === null || myStatus === "None")) {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.likesCount': 1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "Dislike" && (myStatus === null || myStatus === "None")) {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.dislikesCount': 1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === "Like") {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.likesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === "Dislike") {

                result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'likesInfo.dislikesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === null) {

                return true

            }

            return false


        } catch (e) {
            console.error(e)

            return false
        }
    }

    // static async updateLikeInfo(commentId: string, likeStatus: LikeStatus): Promise<boolean> {
    //     try {
    //         // worked
    //         const updated = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: })
    //
    //         return true
    //
    //     } catch (e) {
    //         console.error(e)
    //
    //         return false
    //     }
    // }

    static async updateComment(id: string, content: string): Promise<number | null> {
        try {

            const result: UpdateWriteOpResult = await CommentsModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})

            return result.modifiedCount

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async getCommentById(commentId: string, currentUserId?: string | null): Promise<CommentOutputType | null> {
        try {
            // worked
            const comment: WithId<CommentOutputType> | null = await CommentsModel.findOne({_id: new ObjectId(commentId)})

            if (comment) {

                let myStatus: LikeStatus = 'None'

                if (currentUserId) {
                    myStatus = await LikeRepository.getMyStatusForComment(comment._id.toString(), currentUserId)
                }
                return {
                    id: comment._id.toString(),
                    commentatorInfo: comment.commentatorInfo,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        dislikesCount: comment.likesInfo.dislikesCount,
                        likesCount: comment.likesInfo.likesCount,
                        myStatus: myStatus
                    }
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