import {PostType} from "../db/post-db";
import {blogsCollection, postsCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {PostDbType} from "../models/posts/db/post-db";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostQueryRepository {


    static async getPostById(postId: string): Promise<OutputPostModel | null> {
        try {

            const post = await postsCollection.findOne({_id: new ObjectId(postId)})

            if(!post) {
                return null
            }

            return postMapper(post)

        }  catch (e) {
            return null
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