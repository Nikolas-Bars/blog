import {CommentatorInfo} from "../commentator-info/commentator-info";

export type CommentInputType = {
    content: string
    commentatorInfo: CommentatorInfo
    postId: string
    createdAt: string
}