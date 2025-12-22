import express, {Request, Response} from 'express'
import {BlogsModel, CommentsModel, PostsModel, RequestHistoryModel, SecurityModel, UsersModel} from "../db/db";

export const deleteAllDataRoute = express.Router()

deleteAllDataRoute.delete('/',async (req: Request, res: Response) => {

    await BlogsModel.deleteMany({})

    await PostsModel.deleteMany({})

    await UsersModel.deleteMany({})

    await CommentsModel.deleteMany({})

    await RequestHistoryModel.deleteMany({})

    await SecurityModel.deleteMany({})

    res.sendStatus(204)
})