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