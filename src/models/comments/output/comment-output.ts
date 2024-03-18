import {LikeStatus} from "../../likes/LikesDbType";

export type CommentOutputType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    likesInfo: LikesInfoType
    createdAt: string
}

export type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus
}