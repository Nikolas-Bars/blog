import {postDB, PostType} from "../db/post-db";
import {blogDB, BlogType} from "../db/blog-db";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostRepository {

    static getAll() {
        return postDB
    }

    static getPostById(postId: string) {
        const post = postDB.find((blog) => blog.id === postId)

        if(!post) {
            return 404
        }

        return  post
    }

    static createPost(newPost: NewPostDataType) {

        const blog = blogDB.find((blog) => blog.id === newPost.blogId)!

        const post = {...newPost, blogName: blog.name, id: Number(new Date).toString()}

        postDB.push(post)

        return post


    }

    static updatePost(body: PostType, id: string) {

        let post = postDB.find((post) => post.id === id)

        if (!post) {
            return 404
        }

        Object.assign(post, body);

        return 204
    }

    static deletePost(postId: string) {
        const postIndex = postDB.findIndex((post) => post.id === postId)
        if (postIndex === -1) {
            return 404
        }

        postDB.splice(postIndex, 1)

        return 204
    }
}