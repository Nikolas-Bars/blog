import {WithId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {OutputPostModel} from "../output/output-post";
import {LikeRepository} from "../../../repositories/like-repository";
import {PostRepository} from "../../../repositories/post-repository";


export const postMapper = async (post: WithId<PostDbType>, currentUserId: string | null): Promise<OutputPostModel> => {

    const myStatus = currentUserId ? await PostRepository.getMyStatusForPost(post._id.toString(), currentUserId) : "None"

    const newLikes = await LikeRepository.getLatest3LikesOfPost(post._id.toString())

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
            newestLikes: [
                {
                    addedAt: '',
                    login: '',
                    userId: ''
                }
            ]
        },
    }
}