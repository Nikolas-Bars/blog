import express, {Request, Response} from 'express'
import {blogDB} from "../db/blog-db";
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogValidator} from "../validators/blog-validator";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";
import {blogRoute} from "./blog-route";
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

    const { title, shortDescription, content, blogId, blogName } = req.body

    const newPost = {
        id: Number(new Date).toString(),
        title,
        shortDescription,
        content,
        blogId,
        blogName
    }

    PostRepository.createPost(newPost)

    res.status(201).json(newPost)
})

postRoute.put('/:id', authMiddleware, postValidator(), (req: Request, res: Response) => {

    const result = PostRepository.updatePost(req.body)

    res.sendStatus(result)

})

postRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {

    const result = PostRepository.deletePost(req.params.id)

    res.sendStatus(result)

})