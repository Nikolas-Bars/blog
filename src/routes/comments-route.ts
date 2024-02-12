import express, { Request, Response} from 'express'
import {CommentsService} from "../services/comments.service";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";

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

commentsRouter.delete('/:commentId', accessTokenGuard, async (req: Request, res: Response) => {

    const commentId = req.params.commentId

    const commentatorId = req.userId

    const result: number = await CommentsService.deleteCommentById(commentId, commentatorId)

    res.sendStatus(result)

})