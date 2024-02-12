import express, { Request, Response} from 'express'
import {CommentsService} from "../services/comments.service";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {ObjectId} from "mongodb";

export const commentsRouter = express.Router()

commentsRouter.get('/:commentId', async (req: Request, res: Response)=> {

    const id = req.params.commentId

    const result = await CommentsService.getCommentById(id)

    if(!result) {
        return res.sendStatus(404)
    } else {
        return res.status(200).send(result)
    }
})

commentsRouter.put('/:commentId', accessTokenGuard, async (req: Request, res: Response) => {

    if(!ObjectId.isValid(req.params.commentId)) {
        res.sendStatus(404)
        return
    }

    const commentId = req.params.commentId

    const content = req.body.content

    const result = await CommentsService.updateComment(commentId, content)

    return result ? res.sendStatus(204) : res.sendStatus(404)

})

commentsRouter.delete('/:commentId', accessTokenGuard, async (req: Request, res: Response) => {

    if(!ObjectId.isValid(req.params.commentId)) {
        res.sendStatus(404)
        return
    }

    const commentId = req.params.commentId

    const commentatorId = req.userId

    const result: number | null = await CommentsService.deleteCommentById(commentId, commentatorId)

    return result ? res.sendStatus(result) : res.sendStatus(404)

})