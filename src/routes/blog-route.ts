import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogValidator} from "../validators/blog-validator";
import {BlogRepository} from "../repositories/blog-mongo-repository";
import {OutputBlogType} from "../models/blogs/output/blog-output-model";
import {ObjectId} from "mongodb";

export const blogRoute = express.Router()

blogRoute.get('/',async (req: Request, res: Response)  => {
    const blogs: OutputBlogType[] | null = await BlogRepository.getAll()

    blogs ? res.send(blogs) : res.sendStatus(404)
})

blogRoute.get('/:id',async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    const result = await BlogRepository.getBlogById(req.params.id)

    if (!result) res.sendStatus(404)

    else res.send(result)

})

blogRoute.post('/', authMiddleware, blogValidator(), async (req: Request, res: Response) => {

    const { name, description, websiteUrl, isMembership } = req.body

    const newBlog = {
        name,
        description,
        websiteUrl,
        isMembership,
        createdAt: (new Date()).toISOString()
    }

    const newBlogId = await BlogRepository.createBlog(newBlog)

    if (newBlogId) {

        const createdBlog = await BlogRepository.getBlogById(newBlogId)

        res.status(201).json(createdBlog)

    } else {
        res.sendStatus(404)
    }

})

blogRoute.put('/:id', authMiddleware, blogValidator(), async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    const result = await BlogRepository.updateBlog(req.body, req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    const result = await BlogRepository.deleteBlog(req.params.id)

    result ? res.sendStatus(204) : res.sendStatus(404)

})