import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {PostRepository} from "../repositories/post-repository";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";

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

    static async deletePost(postId: string): Promise<boolean> {

        return await PostRepository.deletePost(postId)

    }
}