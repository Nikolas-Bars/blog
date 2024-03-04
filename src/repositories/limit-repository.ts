import {PostType} from "../db/post-db";
import {blogsCollection, postsCollection, requestHistoryCollection} from "../db/db";
import {postMapper} from "../models/posts/mappers/post-mapper";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {PostDbType} from "../models/posts/db/post-db";
import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";
import {RequestHistoryDbType} from "../models/requestHistory/requestHistoryDbType";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class LimitRepository {

    static async create(data: RequestHistoryDbType): Promise<string | null> {
        try {

            const result = await requestHistoryCollection.insertOne(data)

            if (!result) return null

            return result.insertedId.toString()

        } catch (e) {

            return null

        }
    }

    static async check(data: RequestHistoryDbType): Promise<number | null> {
        try {

            const result = await requestHistoryCollection.countDocuments({ip: data.ip, url: data.url, date: {$gte: data.date}})

            console.log(result, 'datadatadata')

            return result

        } catch (e) {
            return null
        }
    }
}