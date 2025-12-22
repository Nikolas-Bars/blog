import {LikesHistoryServiceClass} from "../services/likes.service";
import express, {Request, Response} from 'express'
import {CreateLikeOutputModel} from "../models/likes/CreateLikeOutputModel";
import {CreateLikeInputModel} from "../models/likes/CreateLikeInputModel";

export class LikesController {

    constructor(protected LikeService: LikesHistoryServiceClass) {}

    async createLike(req: Request, res: Response) {

        const entry: CreateLikeInputModel = { userId: req.body.userId, commentId: req.body.commentId, status: req.body.status}

        const result: CreateLikeOutputModel | null = await this.LikeService.createLike(entry)

        if (result) {
            return res.status(201).send(result)
        } else {
            return res.sendStatus(444)
        }
    }
}