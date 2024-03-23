export type LikesDbType = {
    userId: string
    commentId: string
    status: LikeStatus
}

export type LikeStatus = 'None' | 'Like' | 'Dislike'

export type LikesPostDbType = {
    userId: string
    postId: string
    status: LikeStatus
    updated: string
    login: string
}