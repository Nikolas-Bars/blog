import {WithId} from "mongodb";
import {CommentOutputType} from "../output/comment-output";
import {CommentInputType} from "../input/comment-input";

export const commentMapper = (comment: WithId<CommentInputType>): CommentOutputType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}