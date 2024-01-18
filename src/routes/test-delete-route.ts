import express, {Request, Response} from 'express'
import {blogsCollection, postsCollection} from "../db/db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',async (req: Request, res: Response) => {

    await blogsCollection.deleteMany({})

    await postsCollection.deleteMany({})

    res.sendStatus(204)
})