import {blogDB, BlogType} from "../db/blog-db";
import {blogsCollection} from "../db/db";

export class BlogRepository {

    static async getAll() {

        return await blogsCollection.find({}).toArray()

    }

    static async getBlogById(blogId: string) {

        const blog = await blogsCollection.findOne({id: blogId})

        if(!blog) {
            return 404
        }

        return  blog
    }

    static async createBlog(blog: BlogType) {

        await blogsCollection.insertOne(blog)

    }

    static async updateBlog(body: BlogType, id: string) {

        await blogsCollection.updateOne({id: id}, {$set: {name: body.name, description: body.description, websiteUrl: body.websiteUrl}})

        const blog = await blogsCollection.findOne({id: id})

        if (!blog) {
            return 404
        }

        Object.assign(blog);

        return 204
    }

    static async deleteBlog(blogId: string) {

        const result = await blogsCollection.deleteOne({id: blogId})

        return result.deletedCount === 1 ? 204 : 404

    }
}