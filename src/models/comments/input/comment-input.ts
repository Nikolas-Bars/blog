import {CommentatorInfo} from "../commentator-info/commentator-info";
import {LikeStatus} from "../../likes/LikesDbType";

export type CommentInputType = {
    content: string
    commentatorInfo: CommentatorInfo
    postId: string
    likesInfo: LikesInfoInputType
    createdAt: string
}

export type LikesInfoInputType = {
    likesCount: number,
    dislikesCount: number
}