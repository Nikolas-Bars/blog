import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {PostDbType} from "../models/posts/db/post-db";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";
import {UpdateWriteOpResult} from "mongoose";
import {CommentsModel, LikesModel, LikesPostModel, PostsModel} from "../db/db";
import {LikesDbType, LikeStatus} from "../models/likes/LikesDbType";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostRepository {

    static async getPostById(postId: string, currentUserId: string | null): Promise<OutputPostModel | boolean> {
        try {
            // worked
            const post = await PostsModel.findOne({_id: new ObjectId(postId)})

            if(!post) {
                return false
            }

            return postMapper(post, currentUserId)

        }  catch (e) {
            return false
        }
    }

    static async createPost(newPost: PostDbType): Promise<string | null> {
        try {
                // worked
                const res = await PostsModel.insertMany([
                    {
                        ...newPost,
                        blogName: newPost.blogName
                    }])

                    return res ? res[0]._id.toString() : null

        } catch (e) {
            return null
        }
    }

    static async updatePost(id: string, body: UpdatePostInputModel): Promise<boolean> {

        try {
            // worked
            const result: UpdateWriteOpResult = await PostsModel.updateOne(
                {_id: new ObjectId(id)},
                {$set:
                        {
                            title: body.title,
                            shortDescription: body.shortDescription,
                            content: body.content,
                            blogId: body.blogId
                        }})

            return !!result.modifiedCount

        } catch (e) {
            return false
        }


    }

    static async deletePost(postId: string): Promise<boolean> {
        try {
            // worked
            const result: any = await PostsModel.deleteOne({_id: new ObjectId(postId)})

            return !!result.deletedCount

        } catch (e) {
            return false
        }
    }

    static async deletePostsByBlogId(blogId: string): Promise<boolean> {
        try {
            // worked
            await PostsModel.deleteMany({ blogId: blogId })

            return true

        } catch (e) {
            return false
        }
    }

    static async getMyStatusForPost(postId: string, userId: string): Promise<LikeStatus> {
        try {
            const like: LikesDbType | null = await LikesPostModel.findOne({postId: postId, userId: userId})
            console.log(postId, userId)
            if (!like) return 'None'

            return like.status

        } catch (e) {
            console.error(e)
            return 'None'
        }
    }

    static async updateLikeCountOfPost(commentId: string, likeStatus: LikeStatus, myStatus: LikeStatus | null): Promise<boolean> {
        try {

            let result: UpdateWriteOpResult;

            if (likeStatus === "Like" && myStatus === "Dislike") {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.likesCount': 1, 'extendedLikesInfo.dislikesCount': -1}})

                return !!result.modifiedCount

            }
            if (likeStatus === "Dislike" && myStatus === "Like") {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.dislikesCount': 1, 'extendedLikesInfo.likesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "Like" && (myStatus === null || myStatus === "None")) {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.likesCount': 1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "Dislike" && (myStatus === null || myStatus === "None")) {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.dislikesCount': 1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === "Like") {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.likesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === "Dislike") {

                result = await PostsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: {'extendedLikesInfo.dislikesCount': -1}})

                return !!result.modifiedCount

            }

            if (likeStatus === "None" && myStatus === null) {

                return true

            }

            return false


        } catch (e) {
            console.error(e)

            return false
        }
    }
}