import express, {Request, Response} from 'express'
import {blogDB} from "../db/blog-db";

export const blogRoute = express.Router()

blogRoute.get('/', (req: Request, res: Response) => {
    res.status(201).json(blogDB)
})