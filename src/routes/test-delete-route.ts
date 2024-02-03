import express, {Request, Response} from 'express'
import {blogsCollection, postsCollection, usersCollection} from "../db/db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',async (req: Request, res: Response) => {

    await blogsCollection.deleteMany({})

    await postsCollection.deleteMany({})

    await usersCollection.deleteMany({})

    res.sendStatus(204)
})