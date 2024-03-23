import {WithId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {NewestLikesType, OutputPostModel} from "../output/output-post";
import {LikeRepository} from "../../../repositories/like-repository";
import {PostRepository} from "../../../repositories/post-repository";
import {LikesPostDbType} from "../../likes/LikesDbType";


export const postMapper = async (post: WithId<PostDbType>, currentUserId: string | null): Promise<OutputPostModel> => {

    console.log(currentUserId,'currentUserId')

    const myStatus = currentUserId ? await PostRepository.getMyStatusForPost(post._id.toString(), currentUserId) : "None"

    const new3Likes: LikesPostDbType[] | null = await LikeRepository.getLatest3LikesOfPost(post._id.toString())

    const newLikesMapped: NewestLikesType[] = new3Likes ? new3Likes.map((like) => {
        return {
            userId: like.userId,
            login: like.login,
            addedAt: like.updated
        }
    }) : []

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            likesCount: post.extendedLikesInfo.likesCount,
            myStatus: myStatus,
            newestLikes: newLikesMapped
        },
    }
}