import {WithId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {OutputPostModel} from "../output/output-post";


export const postMapper = (post: WithId<PostDbType>): OutputPostModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}