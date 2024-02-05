import {PostType} from "../db/post-db";
import {blogsCollection, postsCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {PostDbType} from "../models/posts/db/post-db";
import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostRepository {

    // static async getAll(): Promise<OutputPostModel[] | false> {
    //
    //     try {
    //
    //         const posts = await postsCollection.find({}).toArray()
    //
    //         return posts.map((post) => {
    //             return postMapper(post)
    //         })
    //
    //     } catch (e) {
    //         return false
    //     }
    //
    // }

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

    static async createPost(newPost: PostDbType): Promise<string | null> {
        try {
                const result = await postsCollection.insertOne(
                    {
                        ...newPost,
                        blogName: newPost.blogName
                    })

                return result.insertedId.toString()

        } catch (e) {
            return null
        }
    }

    static async updatePost(id: string, body: UpdatePostInputModel): Promise<boolean> {

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

    static async deletePostsByBlogId(blogId: string): Promise<boolean> {
        try {
            const result = await postsCollection.deleteMany({ blogId: blogId })

            console.log(result.deletedCount, 'result')

            return !!result.deletedCount

        } catch (e) {
            return false
        }
    }
}