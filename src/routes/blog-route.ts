import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogValidator} from "../validators/blog-validator";
import {BlogRepository} from "../repositories/blog-mongo-repository";

export const blogRoute = express.Router()

blogRoute.get('/',async (req: Request, res: Response) => {
    const blogs = await BlogRepository.getAll()

    res.send(blogs)
})

blogRoute.get('/:id',async (req: Request, res: Response) => {
    const result = await BlogRepository.getBlogById(req.params.id)

    res.send(result)
})

blogRoute.post('/', authMiddleware, blogValidator(), async (req: Request, res: Response) => {

    const { name, description, websiteUrl } = req.body

    const newBlog = {
        id: Number(new Date).toString(),
        name,
        description,
        websiteUrl
    }

    await BlogRepository.createBlog(newBlog)

    res.status(201).json(newBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidator(), async (req: Request, res: Response) => {

    const result = await BlogRepository.updateBlog(req.body, req.params.id)

    res.sendStatus(result)

})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const result = await BlogRepository.deleteBlog(req.params.id)

    res.sendStatus(result)

})