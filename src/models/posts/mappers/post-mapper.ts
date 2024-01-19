import {WithId} from "mongodb";
import {PostDb} from "../db/post-db";


export const postMapper = (post: WithId<PostDb>) => {
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