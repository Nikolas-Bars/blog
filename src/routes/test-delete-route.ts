import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {blogDB, BlogType} from "../db/blog-db";
import {postDB, PostType} from "../db/post-db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/', authMiddleware, (req: Request, res: Response) => {

    blogDB.length = 0

    postDB.length = 0

    res.sendStatus(204)
})