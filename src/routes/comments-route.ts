import express, { Request, Response} from 'express'
import {CommentsService} from "../services/comments.service";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {ObjectId} from "mongodb";
import {commentValidator} from "../validators/comment-validator";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {LikeStatus} from "../models/likes/LikesDbType";
import {likeValidator} from "../validators/like-validator";

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

commentsRouter.put('/:commentId/like-status', accessTokenGuard, likeValidator(), async (req: Request, res: Response)=> {

    const commentId = req.params.commentId

    const likeStatus: LikeStatus = req.body.likeStatus

    const currentUserId = req.userId

    const comment: CommentOutputType | null = await CommentRepository.getCommentById(commentId)

    if (!comment) return res.sendStatus(404)

    await CommentsService.updateLikeStatus(commentId, currentUserId, likeStatus)

    return res.sendStatus(204)


})

commentsRouter.put('/:commentId', accessTokenGuard, commentValidator(), async (req: Request, res: Response) => {

    if (!req.params) return res.sendStatus(404)

    const commentId = req.params.commentId

    const comment: CommentOutputType | null = await CommentRepository.getCommentById(commentId)

    if (comment && comment.commentatorInfo.userId !== req.userId) {
        return res.sendStatus(403)
    }

    const content = req.body.content

    const result = await CommentsService.updateComment(commentId, content)

    return result ? res.sendStatus(204) : res.sendStatus(404)

})

commentsRouter.delete('/:commentId', accessTokenGuard, async (req: Request, res: Response) => {

    if (!req.params) return res.sendStatus(404)

    const commentId = req.params.commentId

    const commentatorId = req.userId

    const result: number | null = await CommentsService.deleteCommentById(commentId, commentatorId)

    return result ? res.sendStatus(result) : res.sendStatus(404)

})