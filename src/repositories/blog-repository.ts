import {blogDB, BlogType} from "../db/blog-db";

export class BlogRepository {
    static getBlogById(blogId: string) {
        return blogDB.find((blog) => {
            return blog.id === blogId
        })
    }
    static getAll() {
        return blogDB
    }
    static createBlog(blog: BlogType) {
        blogDB.push(blog)
    }
}