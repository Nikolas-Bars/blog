import {PostType} from "../db/post-db";
import {blogsCollection, postsCollection} from "../db/db";
import {BlogType} from "../db/blog-db";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostRepository {

    static async getAll() {
        return await postsCollection.find({}).toArray()
    }

    static async getPostById(postId: string) {
        const post = await postsCollection.findOne({id: postId})

        if(!post) {
            return 404
        }

        return  post
    }

    static async createPost(newPost: NewPostDataType) {

        const blog = await blogsCollection.findOne({id: newPost.blogId})

        const post = {...newPost, blogName: blog ? blog.name : '', id: Number(new Date).toString()}

        await postsCollection.insertOne(post)

        return post


    }

    static async updatePost(body: PostType, id: string) {
        console.log(123)
        await postsCollection.updateOne({id}, {$set: {title: body.title, shortDescription: body.shortDescription, content: body.content, blogId: body.blogId}})
        console.log(444)
        let post = await postsCollection.findOne({id})
        console.log(555)
        if (!post) {
            return 404
        }

        Object.assign(post, body);

        return 204
    }

    static async deletePost(postId: string) {

        const result = await postsCollection.deleteOne({id: postId})

        return result.deletedCount === 1 ? 204 : 404
    }
}