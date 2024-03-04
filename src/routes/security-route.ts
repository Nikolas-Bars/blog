import express, {Request, Response} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostRepository} from "../repositories/post-repository";
import {postValidator} from "../validators/post-validator";
import {OutputPostModel} from "../models/posts/output/output-post";
import {
    HTTP_RESPONSE_CODES,
    PaginationType,
    ParamType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
    ResponseType
} from "../models/common";
import {PostQueryRepository} from "../repositories/post-query-repository";
import {CreatePostInputModel} from "../models/posts/input/create.post.input.model";
import {QueryPostInputModel} from "../models/posts/input/query.post.input.model";
import {PostService} from "../services/post.service";
import {UpdatePostInputModel} from "../models/posts/input/update.post.input.model";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {CommentsService} from "../services/comments.service";
import {CommentOutputType} from "../models/comments/output/comment-output";
import {commentValidator} from "../validators/comment-validator";
import {CommentsQueryRepository, QueryPostDataType} from "../repositories/comments-query-repository";

export const securityRoute = express.Router()

securityRoute.get('/devices',async (req: RequestWithQuery<QueryPostInputModel>, res: ResponseType<PaginationType<OutputPostModel>>) => {

 

})