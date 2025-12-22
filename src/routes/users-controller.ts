import {UserServiceClass} from "../services/user.service";
import {
    HTTP_RESPONSE_CODES,
    PaginationType,
    ParamType,
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery,
    ResponseType
} from "../models/common";
import {CreateUserInputModel} from "../models/users/input/create.user.input.model";
import {OutputUser} from "../models/users/output/output-user";
import {QueryUserInputModel} from "../models/users/input/query.user.input.model";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {Response} from "express";

export class UserController {

    constructor(protected UserService: UserServiceClass) {}

    async createUser(req: RequestWithBody<CreateUserInputModel>, res: ResponseType<OutputUser>) {
        const result: OutputUser | null = await this.UserService.createUser(req.body)

        if (result) {
            return res.status(201).send(result)
        } else {
            return res.sendStatus(400)
        }
    }

    async getUsers(req: RequestWithQuery<QueryUserInputModel>, res: ResponseType<PaginationType<OutputUser>>) {
        const users: PaginationType<OutputUser> | null = await UserQueryRepository.getUsers(req.query)

        if (!users) {
            return res.sendStatus(400)
        } else {
            return res.send(users)
        }
    }

    async deleteUser(req: RequestWithParams<ParamType>, res: Response) {
        const result = await this.UserService.deleteUser(req.params.id)

        if (result) {
            return res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
        } else {
            return res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND)
        }
    }
}