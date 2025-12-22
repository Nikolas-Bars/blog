import {BlogsModel} from "../db/db";
import {BlogDb} from "../models/blogs/db/blog-db";
import {ObjectId} from "mongodb";
import {UpdateBlogInputModel} from "../models/blogs/input/update.blog.input.model";
import {UpdateWriteOpResult} from "mongoose";

export class BlogRepository {
    // worked
    static async createBlog(blog: BlogDb): Promise<string | null> {
        try {
            const res = await BlogsModel.insertMany([
                {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    isMembership: false,
                    createdAt: blog.createdAt
                }])

            return res ? res[0]._id.toString() : null

        } catch (e) {
            console.error(e, 'eeeeeeee')
            return null
        }
    }

    static async updateBlog(body: UpdateBlogInputModel, id: string): Promise<boolean> {
        try {
            // worked
            const result: UpdateWriteOpResult = await BlogsModel.updateOne({_id: new ObjectId(id)}, {$set: {name: body.name, description: body.description, isMembership: false, websiteUrl: body.websiteUrl}})

            return !!result.matchedCount

        } catch (e) {

            return false

        }

    }

    static async deleteBlog(blogId: string): Promise<boolean> {
        // worked
        try {

            const result: any = await BlogsModel.deleteOne({_id: new ObjectId(blogId)})

            return !!result.deletedCount

        } catch (e) {

            return false

        }
    }
}