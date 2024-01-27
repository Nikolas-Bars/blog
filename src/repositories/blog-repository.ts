import {blogsCollection} from "../db/db";
import {BlogDb} from "../models/blogs/db/blog-db";
import {ObjectId} from "mongodb";
import {UpdateBlogInputModel} from "../models/blogs/input/update.blog.input.model";

export class BlogRepository {

    static async createBlog(blog: BlogDb): Promise<string | null> {
        try {

            const res = await blogsCollection.insertOne(
                {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    isMembership: false,
                    createdAt: blog.createdAt
                })

            return res.insertedId.toString()

        } catch (e) {

            return null

        }
    }

    static async updateBlog(body: UpdateBlogInputModel, id: string): Promise<boolean> {
        try {

            const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: {name: body.name, description: body.description, isMembership: false, websiteUrl: body.websiteUrl}})

            return !!result.matchedCount

        } catch (e) {

            return false

        }

    }

    static async deleteBlog(blogId: string): Promise<boolean> {
        try {

            const result = await blogsCollection.deleteOne({_id: new ObjectId(blogId)})

            return !!result.deletedCount

        } catch (e) {

            return false

        }
    }
}