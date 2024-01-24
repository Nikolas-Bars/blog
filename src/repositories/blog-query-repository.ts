import {blogsCollection} from "../db/db";
import {BlogDb} from "../models/blogs/db/blog-db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {blogMapper} from "../models/blogs/mappers/blog-mapper";
import {PaginationType} from "../models/common";

type SortDataType = {
    searchNameTerm?: string | null
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

export class BlogQueryRepository {

    static async getAll(sortData: SortDataType): Promise<PaginationType<OutputBlogType> | null> {
        try{

            const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = sortData

            let filter = {}

            if (searchNameTerm) {
                filter = {
                    name: {
                        $regex: searchNameTerm,
                        $options: 'i'
                    }
                }
            }

            const blogs = await blogsCollection
                .find(filter)
                .sort(sortBy, sortDirection)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray() as WithId<BlogDb>[]

            const totalCount = await blogsCollection
                .countDocuments(filter)

            const pagesCount = Math.ceil(totalCount / pageSize)

            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: blogs.map((blog) => {
                    return blogMapper(blog)
                })
            } as PaginationType<OutputBlogType>

        } catch (e) {

            return null

        }
    }

    static async getBlogById(blogId: string): Promise<OutputBlogType | null> {
        try {

            const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

            if (blog) return blogMapper(blog)

            else return null

        } catch (e) {

            return null

        }
    }


}