import {WithId} from "mongodb";
import {CommentOutputType} from "../output/comment-output";
import {CommentInputType} from "../input/comment-input";
import {LikeRepository} from "../../../repositories/like-repository";

export const commentMapper = async (comment: WithId<CommentInputType>, currentUserId: string | null): Promise<CommentOutputType> => {

    const myStatus = currentUserId ? await LikeRepository.getMyStatusForComment(comment._id.toString(), currentUserId) : "None"
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: {
            dislikesCount: comment.likesInfo.dislikesCount,
            likesCount: comment.likesInfo.likesCount,
            myStatus: myStatus
        }
    }
}