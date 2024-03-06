import express, {Request, Response} from 'express'
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    requestHistoryCollection, securityDevicesSessionCollection,
    usersCollection
} from "../db/db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',async (req: Request, res: Response) => {

    await blogsCollection.deleteMany({})

    await postsCollection.deleteMany({})

    await usersCollection.deleteMany({})

    await commentsCollection.deleteMany({})

    await requestHistoryCollection.deleteMany({})

    await securityDevicesSessionCollection.deleteMany({})

    res.sendStatus(204)
})