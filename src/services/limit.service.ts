import {CreatePostFromBlogInputModel} from "../models/blogs/input/create.post.from.blog.input.model";
import {BlogDb} from "../models/blogs/db/blog-db";
import {BlogRepository} from "../repositories/blog-repository";
import {PostDbType} from "../models/posts/db/post-db";
import {PostRepository} from "../repositories/post-repository";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {UpdateBlogInputModel} from "../models/blogs/input/update.blog.input.model";
import {CreateBlogInputModel} from "../models/blogs/input/create.blog.input.model";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {OutputPostModel} from "../models/posts/output/output-post";
import {LimitRepository} from "../repositories/limit-repository";
import {RequestHistoryDbType} from "../models/requestHistory/requestHistoryDbType";

export class LimitService {
    static async checkAndCreate(data: RequestHistoryDbType, dateForCompare: number) {
        try {

            const checked: number | null = await this.Check(data)

            if (typeof checked === "number" && checked + 1 > 5) return null

            const result: string | null = await LimitRepository.create({...data, date: dateForCompare.toString()})

            if (result) return result

            return null

        } catch (e) {
            console.error(e)
            return null
        }



    }

    static async Check(data: RequestHistoryDbType): Promise<number | null> {
        try {

            const result: number | null = await LimitRepository.check(data)

            if (result === null) return null

            return result


        } catch (e) {

            console.error(e)
            return null

        }

    }
}