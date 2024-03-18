import {CommentRepository} from "../repositories/comment-repository";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {HTTP_RESPONSE_CODES} from "../models/common";
import {LikeStatus} from "../models/likes/LikesDbType";

export class CommentsService {

    static async getCommentById(commentId: string): Promise<CommentOutputType | null> {
        try {

            return await CommentRepository.getCommentById(commentId)

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

            await CommentRepository.updateLikeStatus(commentId, currentUserId, likeStatus)

            return true

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