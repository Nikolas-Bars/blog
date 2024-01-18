import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-mongo-repository";
import {postValidator} from "../validators/post-validator";

export const postRoute = express.Router()

postRoute.get('/',async (req: Request, res: Response) => {

    const posts = await PostRepository.getAll()

    res.send(posts)
})

postRoute.get('/:id',async (req: Request, res: Response) => {
    const result = await PostRepository.getPostById(req.params.id)

    res.send(result)
})

postRoute.post('/', authMiddleware, postValidator(), async (req: Request, res: Response) => {

    const { title, shortDescription, content, blogId } = req.body

    const newPostData = {
        title,
        shortDescription,
        content,
        blogId
    }

    const post = await PostRepository.createPost(newPostData)

    res.status(201).json(post)
})

postRoute.put('/:id', authMiddleware, postValidator(), async (req: Request, res: Response) => {

    const result = await PostRepository.updatePost(req.body, req.params.id)

    res.sendStatus(result)

})

postRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const result = await PostRepository.deletePost(req.params.id)

    res.sendStatus(result)

})