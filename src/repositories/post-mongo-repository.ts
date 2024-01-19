import {PostType} from "../db/post-db";
import {blogsCollection, postsCollection} from "../db/db";
import {BlogType} from "../db/blog-db";
import {PostDb} from "../models/posts/db/post-db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {blogMapper} from "../models/blogs/mappers/blog-mapper";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostRepository {

    static async getAll(): Promise<OutputPostModel[] | false> {

        try {

            const posts = await postsCollection.find({}).toArray()

            return posts.map((post) => {
                return postMapper(post)
            })

        } catch (e) {
            return false
        }

    }

    static async getPostById(postId: string): Promise<OutputPostModel | boolean> {
        try {

            const post = await postsCollection.findOne({_id: new ObjectId(postId)})

            if(!post) {
                return false
            }

            return postMapper(post)

        }  catch (e) {
            return false
        }
    }

    static async createPost(newPost: NewPostDataType): Promise<OutputPostModel | false> {
        try {

            const blog = await blogsCollection.findOne({_id: new ObjectId(newPost.blogId)})

            if (blog) {
                const createdDate = (new Date()).toISOString()
                const result = await postsCollection.insertOne(
                    {
                        ...newPost,
                        blogName: blog.name,
                        createdAt: createdDate
                    })

                return {
                    id: result.insertedId.toString(),
                    ...newPost,
                    blogName: blog.name,
                    createdAt: createdDate
                }
            } else {
                return false
            }

        } catch (e) {
            return false
        }
    }

    static async updatePost(body: PostType, id: string): Promise<boolean> {

        try {

            const result = await postsCollection.updateOne(
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

            const result = await postsCollection.deleteOne({_id: new ObjectId(postId)})

            return !!result.deletedCount

        } catch (e) {
            return false
        }

    }
}