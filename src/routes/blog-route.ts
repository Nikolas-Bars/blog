import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogValidator} from "../validators/blog-validator";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {ObjectId} from "mongodb";
import {
    HTTP_RESPONSE_CODES,
    PaginationType,
    ParamType,
    RequestWithBody, RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery,
    ResponseType
} from "../models/common";
import {QueryBlogInputModel} from "../models/blogs/input/query.blog.input.model";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {postFromBlogValidator} from "../validators/post-validator";
import {CreatePostFromBlogInputModel} from "../models/blogs/input/create.post.from.blog.input.model";
import {BlogServices} from "../services/blog.service";
import {UpdateBlogInputModel} from "../models/blogs/input/update.blog.input.model";
import {CreateBlogInputModel} from "../models/blogs/input/create.blog.input.model";
import {OutputPostModel} from "../models/posts/output/output-post";
import {QueryPostsByBlogIdModel} from "../models/blogs/input/QueryPostsByBlogIdModel";
import {JWTService} from "../services/JWT.service";

export const blogRoute = express.Router()

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response)  => {

    const sortData = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    }

    const blogs: PaginationType<OutputBlogType> | null = await BlogQueryRepository.getAll(sortData)

    blogs ? res.send(blogs) : res.sendStatus(404)
})

blogRoute.get('/:id',async (req: RequestWithParams<ParamType>, res: Response) => {

    const id = req.params.id

    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    const result = await BlogQueryRepository.getBlogById(req.params.id)

    if (!result) res.sendStatus(404)

    else res.send(result)

})

blogRoute.get('/:id/posts', async (req: RequestWithParamsAndQuery<ParamType, QueryPostsByBlogIdModel>, res: ResponseType<PaginationType<OutputPostModel>>) => {

    let currentUserId = null

    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]

        const payload: any = await JWTService.verifyToken(token)

        if (payload) {

            currentUserId = payload.userId

        }
    }

    const blogId = req.params.id

    if (!ObjectId.isValid(blogId)) {
        res.sendStatus(404)
    }

    const blog = BlogQueryRepository.getBlogById(blogId)

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
    }

    const queryData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const result = await BlogQueryRepository.getPostsByBlogId(blogId, queryData, currentUserId)

    result ? res.status(200).json(result) : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)

})

blogRoute.post('/', authMiddleware, blogValidator(), async (req: RequestWithBody<CreateBlogInputModel>, res: Response) => {

    const { name, description, websiteUrl } = req.body

    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership: true,
        createdAt: (new Date()).toISOString()
    }

    const result: OutputBlogType | null = await BlogServices.createBlogService(newBlog)

    if (result) {

        res.status(201).json(result)

    } else {
        res.sendStatus(404)
    }
})

blogRoute.post('/:id/posts', authMiddleware, postFromBlogValidator(), async (req: RequestWithParamsAndBody<ParamType, CreatePostFromBlogInputModel>, res: ResponseType<OutputPostModel>) => {

    const id = req.params.id

    if(!ObjectId.isValid(id)){
        res.sendStatus(404)
    }

    const data: CreatePostFromBlogInputModel = {
        shortDescription: req.body.shortDescription,
        title: req.body.title,
        content: req.body.content
    }

    const result: OutputPostModel | null = await BlogServices.createPostToBlog(id, data, req.userId)

    if (result) {
        res.status(HTTP_RESPONSE_CODES.CREATED).json(result)
    } else {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
    }

})

blogRoute.put('/:id', authMiddleware, blogValidator(), async (req: RequestWithParamsAndBody<ParamType, UpdateBlogInputModel>, res: Response) => {

    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    const blogId = req.params.id

    const data: UpdateBlogInputModel = { name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl }

    const result = await BlogServices.updateBlogService(blogId, data)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const blogId = req.params.id

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }

    const result = await BlogServices.deleteBlogService(blogId)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

// blogRoute.put('/:id', authMiddleware, blogValidator(), async (req: Request, res: Response) => {
//     if(!ObjectId.isValid(req.params.id)){
//         res.sendStatus(404)
//         return
//     }
//
//     const result = await BlogRepository.updateBlog(req.body, req.params.id)
//
//     result ? res.sendStatus(204) : res.sendStatus(404)
//
// })