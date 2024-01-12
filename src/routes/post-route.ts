import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-repository";
import {postValidator} from "../validators/post-validator";

export const postRoute = express.Router()

postRoute.get('/',(req: Request, res: Response) => {

    const posts = PostRepository.getAll()

    res.send(posts)
})

postRoute.get('/:id',(req: Request, res: Response) => {
    const result = PostRepository.getPostById(req.params.id)

    res.send(result)
})

postRoute.post('/', authMiddleware, postValidator(), (req: Request, res: Response) => {

    const { title, shortDescription, content, blogId } = req.body

    const newPostData = {
        title,
        shortDescription,
        content,
        blogId
    }

    const post = PostRepository.createPost(newPostData)

    res.status(201).json(post)
})

postRoute.put('/:id', authMiddleware, postValidator(), (req: Request, res: Response) => {

    const result = PostRepository.updatePost(req.body, req.params.id)

    res.sendStatus(result)

})

postRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {

    const result = PostRepository.deletePost(req.params.id)

    res.sendStatus(result)

})