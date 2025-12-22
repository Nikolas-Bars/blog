import {LikeStatus} from "../../likes/LikesDbType";

export type PostDbType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: LikesPostType
}

export type LikesPostType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: NewestLikesType[]
}

export type NewestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}
