import {WithId} from "mongodb";
import {BlogDb} from "../db/blog-db";
import {OutputBlogType} from "../output/blog-output-model";

export const blogMapper = (blog: WithId<BlogDb>): OutputBlogType => {
    return{
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt,
    }
}