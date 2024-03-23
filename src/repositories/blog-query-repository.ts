import {BlogsModel, PostsModel} from "../db/db";
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
            // worked
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
            let sortOptions: {[key: string]: SortDirection} = {};

            if (sortBy && sortDirection) {
                sortOptions[sortBy] = sortDirection;
            }
            const blogs = await BlogsModel
                // ищем элементы с параметрами из объекта filter
                .find(filter)
                // указываем как сортировать результаты - по умолчанию по дате создания
                .sort(sortOptions)
                // указываем параметры пагинации
                .skip((pageNumber - 1) * pageSize)
                // количество результатов на странице
                .limit(pageSize)

            // получаем общее количество документов
            const totalCount = await BlogsModel
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

    static async getPostsByBlogId(blogId: string, queryData: QueryParamsForPostsByBlogId, currentUserId: null | string): Promise<PaginationType<OutputPostModel> | null> {
        try {
            // worked
            const {pageNumber, pageSize, sortBy, sortDirection} = queryData

            let sortOptions: {[key: string]: SortDirection} = {};

            if (sortBy && sortDirection) {
                sortOptions[sortBy as string] = sortDirection as SortDirection;
            }

            const posts = await PostsModel
                .find({ blogId: blogId })
                .sort(sortOptions)
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)


            const totalCount = await PostsModel.countDocuments({blogId: blogId})

            const pagesCount = Math.ceil(totalCount / pageSize)

            if (posts.length) {
                const items = await Promise.all(posts.map(async (post) => {
                    return postMapper(post, currentUserId);
                }))

                return {
                    pagesCount: pagesCount,
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: items
                }
            } else {
                return null
            }

        } catch(e) {
            console.error(e)

            return null
        }
    }

    static async getBlogById(blogId: string): Promise<OutputBlogType | null> {
        try {
            // worked
            const blog = await BlogsModel.findOne({_id: new ObjectId(blogId)})

            if (blog) return blogMapper(blog)

            else return null

        } catch (e) {

            return null

        }
    }


}