export type CreateLikeInputModel = {
    userId: string
    commentId: string
    status: LikeStatus
}

export type LikeStatus = 'None' | 'Like' | 'Dislike'
