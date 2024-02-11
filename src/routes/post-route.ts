import express, {Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-repository";
import {postValidator} from "../validators/post-validator";
import {OutputPostModel} from "../models/posts/output/output-post";
import {
    HTTP_RESPONSE_CODES,
    PaginationType,
    ParamType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    ResponseType
} from "../models/common";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {QueryPostInputModel} from "../models/posts/input/query.post.input.model";
import {PostService} from "../services/post.service";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";

export const postRoute = express.Router()

postRoute.get('/',async (req: RequestWithQuery<QueryPostInputModel>, res: ResponseType<PaginationType<OutputPostModel>>) => {

    const queryData = {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc'
    }

    const posts: PaginationType<OutputPostModel> | null = await PostQueryRepository.getAll(queryData)

    posts ? res.send(posts) : res.sendStatus(404)

})

postRoute.get('/:id',async (req: RequestWithParams<ParamType>, res: Response) => {

    const result = await PostRepository.getPostById(req.params.id)

    result ? res.status(200).json(result) : res.sendStatus(404)

})

postRoute.post('/', authMiddleware, postValidator(), async (req: RequestWithBody<CreatePostInputModel>, res: Response) => {

    const newPostData: CreatePostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }

    const newPostId: string | null = await PostService.createPost(newPostData)

    let createdPost

    if (!newPostId) {
        res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST)
    } else {
        createdPost = await PostQueryRepository.getPostById(newPostId)
    }

    res.status(201).json(createdPost)

})

postRoute.put('/:id', authMiddleware, postValidator(), async (req: RequestWithParamsAndBody<ParamType, UpdatePostInputModel>, res: Response) => {

    const updateData = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }

    const result: boolean = await PostService.updatePost(req.params.id, updateData)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: Response) => {

    const result: boolean = await PostService.deletePost(req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})