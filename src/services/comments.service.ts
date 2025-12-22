import {CommentRepository} from "../repositories/comment-repository";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {HTTP_RESPONSE_CODES} from "../models/common";
import {LikeStatus} from "../models/likes/LikesDbType";
import {LikeRepository} from "../repositories/like-repository";

export class CommentsService {

    static async getCommentById(commentId: string, currentUserId?: string | null): Promise<CommentOutputType | null> {
        try {

            return await CommentRepository.getCommentById(commentId, currentUserId)

        } catch (e) {

            console.error(e)

            return null

        }
    }

    static async updateComment(commentId: string, content: string): Promise<boolean> {

        try {

            const result = await CommentRepository.updateComment(commentId, content)

            return !!result

        } catch (e) {
            console.error(e)

            return false
        }

    }

    static async updateLikeStatus(commentId: string, currentUserId: string, likeStatus: LikeStatus): Promise<boolean> {

        try {

            const like = await LikeRepository.getCommentLikeData(currentUserId, commentId)
            let myStatus = null
            if (like) {
                console.log(like, 'lekelekelekeleke')
                myStatus = like.status
                await LikeRepository.updateLikeStatus(likeStatus, like._id.toString())

            } else {

                const result: boolean = await LikeRepository.createLikeStatus(likeStatus, commentId, currentUserId)

            }

            console.log(commentId, likeStatus, 'commentId, likeStatuscommentId, likeStatus')

            return await CommentRepository.updateLikeCount(commentId, likeStatus, myStatus)

        } catch (e) {
            console.error(e)

            return false
        }

    }

    static async deleteCommentById(commentId: string, userId: string): Promise<number | null> {
        try {

            const comment: CommentOutputType | null = await CommentRepository.getCommentById(commentId)

            if (comment && comment.commentatorInfo.userId === userId) {
                const result = await CommentRepository.deleteOneComment(commentId)

                if (result) return HTTP_RESPONSE_CODES.NO_CONTENT

                else return HTTP_RESPONSE_CODES.NOT_FOUND

            } else if (!comment) {

                return HTTP_RESPONSE_CODES.NOT_FOUND

            }

            return HTTP_RESPONSE_CODES.FORBIDDEN

        } catch (e) {
            console.error(e)

            return null
        }
    }
}