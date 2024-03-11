import express, {Request, Response} from 'express'
import {blogsModel, CommentsModel, PostsModel, RequestHistoryModel, SecurityModel, UsersModel} from "../db/db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',async (req: Request, res: Response) => {

    await blogsModel.deleteMany({})

    await PostsModel.deleteMany({})

    await UsersModel.deleteMany({})

    await CommentsModel.deleteMany({})

    await RequestHistoryModel.deleteMany({})

    await SecurityModel.deleteMany({})

    res.sendStatus(204)
})