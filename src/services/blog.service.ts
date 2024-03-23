import {CreatePostFromBlogInputModel} from "../models/blogs/input/create.post.from.blog.input.model";
import {BlogDb} from "../models/blogs/db/blog-db";
import {BlogRepository} from "../repositories/blog-repository";
import {PostDbType} from "../models/posts/db/post-db";
import {PostRepository} from "../repositories/post-repository";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {UpdateBlogInputModel} from "../models/blogs/input/update.blog.input.model";
import {CreateBlogInputModel} from "../models/blogs/input/create.blog.input.model";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {OutputPostModel} from "../models/posts/output/output-post";

export class BlogServices {

    static async createPostToBlog(blogId: string, createPostModel: CreatePostFromBlogInputModel, currentUserId: string): Promise<OutputPostModel | null> {

        const { shortDescription, title, content} = createPostModel

        const blog: BlogDb | null = await BlogQueryRepository.getBlogById(blogId)

        if (!blog) {
            return null
        }

        const newPost: PostDbType = {
            title,
            shortDescription,
            content,
            blogId: blogId,
            blogName: title,
            createdAt: (new Date()).toISOString(),
            extendedLikesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: 'None',
                newestLikes: []
            },
        }

        const insertedId: string | null = await PostRepository.createPost(newPost)

        if (!insertedId) {
            return null
        }

        return await PostQueryRepository.getPostById(insertedId!, currentUserId)

    }

    static async updateBlogService(blogId: string, updateBlogModelData: UpdateBlogInputModel): Promise<boolean> {

        return await BlogRepository.updateBlog(updateBlogModelData, blogId)

    }

    static async deleteBlogService(blogId: string): Promise<boolean> {
        try {
            const result = await BlogRepository.deleteBlog(blogId)

            if (result) {

                return await PostRepository.deletePostsByBlogId(blogId)

            } else {
                return false
            }
        } catch (e) {
            console.error(e)

            return false
        }


    }

    static async createBlogService(newBlog:  CreateBlogInputModel &  { isMembership: boolean } ): Promise<OutputBlogType | null> {

        const newBlogId = await BlogRepository.createBlog({ ...newBlog, createdAt: (new Date()).toISOString() })

        if (newBlogId) {

            return await BlogQueryRepository.getBlogById(newBlogId)

        } else {
            return null
        }
    }
}