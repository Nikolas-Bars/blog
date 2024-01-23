import {blogsCollection} from "../db/db";
import {BlogDb} from "../models/blogs/db/blog-db";
import {ObjectId, WithId} from "mongodb";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {blogMapper} from "../models/blogs/mappers/blog-mapper";

export class BlogRepository {

    static async getAll(): Promise<OutputBlogType[] | null> {
        try{

            const blogs = await blogsCollection.find({}).toArray()

            return blogs.map((blog) => {
                return blogMapper(blog)
            })

        } catch (e) {

            return null

        }
    }

    static async getBlogById(blogId: string): Promise<OutputBlogType | null> {
        try {

            const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

            if (blog) return blogMapper(blog)

            else return null

        } catch (e) {

            return null

        }
    }

    static async createBlog(blog: BlogDb): Promise<string | null> {
        try {

            const res = await blogsCollection.insertOne(
                {name: blog.name,
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

    static async updateBlog(body: BlogDb, id: string): Promise<boolean> {
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