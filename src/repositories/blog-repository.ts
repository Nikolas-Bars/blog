import {blogDB, BlogType} from "../db/blog-db";

export class BlogRepository {

    static getAll() {
        return blogDB
    }

    static getBlogById(blogId: string) {
        const blog = blogDB.find((blog) => blog.id === blogId)

        if(!blog) {
            return 404
        }

        return  blog
    }

    static createBlog(blog: BlogType) {
        blogDB.push(blog)
    }

    static updateBlog(body: BlogType, id) {
        let blog = blogDB.find((blog) => blog.id === id)

        if (!blog) {
            return 404
        }

        Object.assign(blog, body);

        return 204
    }

    static deleteBlog(blogId: string) {
        const blogIndex = blogDB.findIndex((blog) => blog.id === blogId)
        if (blogIndex === -1) {
            return 404
        }

        blogDB.splice(blogIndex, 1)

        return 204
    }
}