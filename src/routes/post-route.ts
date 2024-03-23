import express, {Request, Response} from 'express'
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
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {CommentsService} from "../services/comments.service";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {commentValidator} from "../validators/comment-validator";
import {CommentsQueryRepository, QueryPostDataType} from "../repositories/comments-query-repository";
import {JWTService} from "../services/JWT.service";
import {LikeStatus} from "../models/likes/LikesDbType";
import {likeValidator} from "../validators/like-validator";
import {UserService} from "../composition-root";
import {UserRepository} from "../repositories/user-repository";

export const postRoute = express.Router()

postRoute.get('/',async (req: RequestWithQuery<QueryPostInputModel>, res: ResponseType<PaginationType<OutputPostModel>>) => {

    let currentUserId = null

    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]

        const payload: any = await JWTService.verifyToken(token)

        if (payload) {

            currentUserId = payload.userId

        }
    }

    const queryData = {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc'
    }

    const posts: PaginationType<OutputPostModel> | null = await PostQueryRepository.getAll(queryData, currentUserId)

    posts ? res.send(posts) : res.sendStatus(404)

})

postRoute.get('/:id',async (req: RequestWithParams<ParamType>, res: Response) => {

    let currentUserId = null

    if (req.headers && req.headers.authorization) {

        const token = req.headers.authorization.split(' ')[1]

        const payload: any = await JWTService.verifyToken(token)

        if (payload) {

            currentUserId = payload.userId

        }
    }

    const result = await PostRepository.getPostById(req.params.id, currentUserId)

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
        createdPost = await PostQueryRepository.getPostById(newPostId, null)
    }

    res.status(201).json(createdPost)

})

postRoute.post('/:postId/comments', accessTokenGuard, commentValidator(), async (req: Request, res: Response) => {

    const postId = req.params.postId

    const content: string = req.body.content

    const commentatorId = req.userId

    const resultId = await PostService.createCommentForPost(postId, content, commentatorId, content, req.userId)

    if (!resultId) {

        return res.sendStatus(404)

    } else {
        const comment: CommentOutputType | null = await CommentsService.getCommentById(resultId)

        return comment ? res.status(201).send(comment) : res.sendStatus(404)
    }

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

postRoute.put('/:id/like-status', accessTokenGuard, likeValidator(), async (req: Request, res: Response) => {

    const postId = req.params.id

    const likeStatus: LikeStatus = req.body.likeStatus

    const currentUserId = req.userId

    const post = await PostRepository.getPostById(postId, req.userId)

    if (!post) {
        return res.sendStatus(404)
    }

    await PostService.updateLikeStatusOfPost(postId, currentUserId, likeStatus, req.login)

    return res.sendStatus(204)

})

postRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: Response) => {

    const result: boolean = await PostService.deletePost(req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

postRoute.get('/:postId/comments', async (req: Request, res: Response) => {

    let currentUserId = null

    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]

        const payload: any = await JWTService.verifyToken(token)

        if (payload) {

            currentUserId = payload.userId

        }
    }

    const postId = req.params.postId

    const post = await PostQueryRepository.getPostById(postId, currentUserId)

    if (!post) {
        return res.sendStatus(404)
    }

    const queryData = {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc'
    } as QueryPostDataType

    const comments: PaginationType<CommentOutputType> | null = await CommentsQueryRepository.getCommentsForPostById(queryData, postId, currentUserId)

    comments ? res.send(comments) : res.sendStatus(404)

})