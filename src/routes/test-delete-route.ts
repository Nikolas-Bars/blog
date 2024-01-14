import express, {Request, Response} from 'express'
import {blogDB} from "../db/blog-db";
import {postDB} from "../db/post-db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',(req: Request, res: Response) => {

    blogDB.length = 0

    postDB.length = 0

    res.sendStatus(204)
})