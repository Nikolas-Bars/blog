import express, {Response} from 'express'
import {PaginationType, RequestWithBody, RequestWithQuery, ResponseType} from "../models/common";
import {QueryUserInputModel} from "../models/users/input/query.user.input.model";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {UserService} from "../services/user.service";
import {OutputUser} from "../models/users/output/output-user";
import {InputAuthModel} from "../models/auth/input/input-auth-model";

export const authRoute = express.Router()

authRoute.post('/', async (req: RequestWithBody<InputAuthModel>, res: Response) => {

    const checkResult = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    console.log(checkResult, 'checkResult')

    return checkResult ?  res.sendStatus(200) : res.sendStatus(401)

})