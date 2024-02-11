import express, {Response} from 'express'
import {
    HTTP_RESPONSE_CODES,
    PaginationType,
    ParamType,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    ResponseType
} from "../models/common";
import {QueryUserInputModel} from "../models/users/input/query.user.input.model";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {UserService} from "../services/user.service";
import {OutputUser} from "../models/users/output/output-user";
import {userCreateValidator} from "../validators/user-validator";
import {authMiddleware} from "../middlewares/auth-middleware";

export const userRoute = express.Router()

userRoute.get('/',async (req: RequestWithQuery<QueryUserInputModel>, res: ResponseType<PaginationType<OutputUser>>) => {

    const users: PaginationType<OutputUser> | null = await UserQueryRepository.getUsers(req.query)

    if(!users) {
        return res.sendStatus(400)
    } else {
        return res.send(users)
    }
})

userRoute.post('/', authMiddleware, userCreateValidator(), async (req: RequestWithBody<CreateUserInputModel>, res: ResponseType<OutputUser>) => {

    const result: OutputUser | null = await UserService.createUser(req.body)

    if (result) {
        return res.status(201).send(result)
    } else {
        return res.sendStatus(400)
    }
})

userRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<ParamType>, res: Response) => {

    const result = await UserService.deleteUser(req.params.id)

    if (result) {
        return res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    } else {
        return res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
    }
})