import {blogsCollection, postsCollection} from "../db/db";
import {BlogDb} from "../models/blogs/db/blog-db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {blogMapper} from "../models/blogs/mappers/blog-mapper";
import {PaginationType} from "../models/common";
import {OutputPostModel} from "../models/posts/output/output-post";
import {postMapper} from "../models/posts/mappers/post-mapper";

type SortDataType = {
    searchNameTerm?: string | null
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

type QueryParamsForPostsByBlogId = {
    sortBy: string
    sortDirection: string
    pageNumber: number
    pageSize: number
}

export class BlogQueryRepository {

    static async getAll(sortData: SortDataType): Promise<PaginationType<OutputBlogType> | null> {
        try{

            const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = sortData

            let filter = {}
            // указваем параметры поиска по тайтлу если нужно
            if (searchNameTerm) {
                // записываем в параметры для поиска. Если сюда не попадем значит будут возвращены все элементы.
                filter = {
                    name: {
                        // ищем в name указанную строку
                        $regex: searchNameTerm,
                        // игнорирование регистра
                        $options: 'i'
                    }
                }
            }

            const blogs = await blogsCollection
                // ищем элементы с параметрами из объекта filter
                .find(filter)
                // указываем как сортировать результаты - по умолчанию по дате создания
                .sort(sortBy, sortDirection)
                // указываем параметры пагинации
                .skip((pageNumber - 1) * pageSize)
                // количество результатов на странице
                .limit(pageSize)
                // преобразуем в массив
                .toArray() as WithId<BlogDb>[]

            // получаем общее количество документов
            const totalCount = await blogsCollection
                .countDocuments(filter)
            // считаем количество страниц
            const pagesCount = Math.ceil(totalCount / pageSize)
            // возвращаем объект сформированный на основании всех данных
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                // каждый блог нужно мапить так как в нем не вкусный id
                items: blogs.map((blog) => {
                    return blogMapper(blog)
                })
            } as PaginationType<OutputBlogType>

        } catch (e) {

            return null

        }
    }

    static async getPostsByBlogId(blogId: string, queryData: QueryParamsForPostsByBlogId): Promise<PaginationType<OutputPostModel> | null> {
        try {

            const {pageNumber, pageSize, sortBy, sortDirection} = queryData

            const posts = await postsCollection
                .find({blogId: blogId})
                .sort(sortBy, sortDirection as SortDirection)
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray()

            const totalCount = await postsCollection.countDocuments({blogId: blogId})

            const pagesCount = Math.ceil(totalCount / pageSize)

            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts.map((post) => {
                    return postMapper(post)
                })
            }

        } catch(e) {
            console.error(e)

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