import express, {Request, Response} from 'express'
import {blogDB} from "../db/blog-db";
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogValidator} from "../validators/blog-validator";
import {BlogRepository} from "../repositories/blog-repository";

export const blogRoute = express.Router()

blogRoute.get('/',(req: Request, res: Response) => {
    const blogs = BlogRepository.getAll()
    res.send(blogs)
})

blogRoute.get('/:id',(req: Request, res: Response) => {
    const result = BlogRepository.getBlogById(req.params.id)

    res.send(result)
})

blogRoute.post('/', authMiddleware, blogValidator(), (req: Request, res: Response) => {

    const { name, description, websiteUrl } = req.body

    const newBlog = {
        id: Number(new Date).toString(),
        name,
        description,
        websiteUrl
    }

    BlogRepository.createBlog(newBlog)

    res.status(201).json(newBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidator(), (req: Request, res: Response) => {

    const result = BlogRepository.updateBlog(req.body, req.params.id)

    res.sendStatus(result)

})

blogRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {

    const result = BlogRepository.deleteBlog(req.params.id)

    res.sendStatus(result)

})