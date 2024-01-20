import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-mongo-repository";
import {postValidator} from "../validators/post-validator";
import {OutputPostModel} from "../models/posts/output/output-post";

export const postRoute = express.Router()

postRoute.get('/',async (req: Request, res: Response) => {

    const posts: OutputPostModel[] | false = await PostRepository.getAll()

    posts ? res.send(posts) : res.sendStatus(404)

})

postRoute.get('/:id',async (req: Request, res: Response) => {

    const result = await PostRepository.getPostById(req.params.id)

    result ? res.status(200).json(result) : res.sendStatus(404)

})

postRoute.post('/', authMiddleware, postValidator(), async (req: Request, res: Response) => {

    const { title, shortDescription, content, blogId } = req.body

    const newPostData = {
        title,
        shortDescription,
        content,
        blogId
    }

    const post: OutputPostModel | false = await PostRepository.createPost(newPostData)

    post ? res.status(201).json(post) : res.sendStatus(404)

})

postRoute.put('/:id', authMiddleware, postValidator(), async (req: Request, res: Response) => {

    const result: boolean = await PostRepository.updatePost(req.body, req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

postRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const result: boolean = await PostRepository.deletePost(req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})