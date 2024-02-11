import {CommentRepository} from "../repositories/comment-repository";
import {CommentOutputType} from "../models/comments/output/comment-output";

export class CommentsService {

    static async getCommentById(commentId: string): Promise<CommentOutputType | null> {
        try {

            return await CommentRepository.getCommentById(commentId)

        } catch (e) {

            console.error(e)

            return null

        }
    }
}