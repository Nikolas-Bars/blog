import express, {Response} from 'express'
import {RequestWithBody} from "../models/common";
import {UserService} from "../services/user.service";
import {InputAuthModel} from "../models/auth/input/input-auth-model";

export const authRoute = express.Router()

authRoute.post('/login', async (req: RequestWithBody<InputAuthModel>, res: Response) => {

    const checkResult = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    console.log(checkResult, 'checkResult')

    return checkResult ?  res.sendStatus(200) : res.sendStatus(401)

})