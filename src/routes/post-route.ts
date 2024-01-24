import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-repository";
import {postValidator} from "../validators/post-validator";
import {OutputPostModel} from "../models/posts/output/output-post";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/db";
import {HTTP_RESPONSE_CODES, RequestWithBody} from "../models/common";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";

export const postRoute = express.Router()

postRoute.get('/',async (req: Request, res: Response) => {

    const posts: OutputPostModel[] | false = await PostRepository.getAll()

    posts ? res.send(posts) : res.sendStatus(404)

})

postRoute.get('/:id',async (req: Request, res: Response) => {

    const result = await PostRepository.getPostById(req.params.id)

    result ? res.status(200).json(result) : res.sendStatus(404)

})

postRoute.post('/', authMiddleware, postValidator(), async (req: RequestWithBody<CreatePostInputModel>, res: Response) => {

    const { title, shortDescription, content, blogId } = req.body

    const createdAt = (new Date()).toISOString()

    let newPostId

    const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

    if (!blog) {
        res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    }

    const newPostData = {
        title,
        shortDescription,
        content,
        blogId,
        createdAt
    }

    if (blog) {
        newPostId = await PostRepository.createPost({...newPostData, blogName: blog.name})
    }

    if (!newPostId) {
        res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    }

    const createdPost = await PostQueryRepository.getPostById(newPostId!)

    if (!createdPost) {
        res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    }

    res.status(201).json(createdPost)

})

postRoute.put('/:id', authMiddleware, postValidator(), async (req: Request, res: Response) => {

    const result: boolean = await PostRepository.updatePost(req.body, req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

postRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const result: boolean = await PostRepository.deletePost(req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})