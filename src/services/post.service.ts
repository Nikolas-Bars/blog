import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {PostRepository} from "../repositories/post-repository";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {OutputPostModel} from "../models/posts/output/output-post";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {CommentatorInfo} from "../models/comments/commentator-info/commentator-info";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentRepository} from "../repositories/comment-repository";

export class PostService {
    static async createPost(data: CreatePostInputModel): Promise<string | null> {

        const blog = await BlogQueryRepository.getBlogById(data.blogId)

        const createdAt = (new Date()).toISOString()

        if (!blog) {
            return null
        }

        return await PostRepository.createPost({
            blogId: data.blogId,
            content: data.content,
            title: data.title,
            shortDescription: data.shortDescription,
            createdAt,
            blogName: blog.name
        })
    }

    static async updatePost(postId: string, data: UpdatePostInputModel): Promise<boolean> {

        return await PostRepository.updatePost(postId, data)

    }

    static async createCommentForPost(postId: string, userId: string, commentatorId: string, content: string): Promise<string | null> {
        try {
            const post: OutputPostModel | null = await PostQueryRepository.getPostById(postId)

            if (!post) {
                return null
            }

            const commentator: CommentatorInfo | null = await UserQueryRepository.getCommentatorById(commentatorId)

            if (post && commentator) {
                const commentData: CommentInputType = {
                    content: content,
                    commentatorInfo: {
                        userLogin: commentator.userLogin,
                        userId: commentator.userId
                    },
                    createdAt: (new Date()).toISOString(),
                    postId: postId,
                    likesInfo: {
                        dislikesCount: 0,
                        likesCount: 0
                    }
                }

                return await CommentRepository.createComment(commentData)
            } else {
                return null
            }

        } catch(e) {
            console.error(e)

            return null
        }

    }

    static async deletePost(postId: string): Promise<boolean> {

        return await PostRepository.deletePost(postId)

    }
}