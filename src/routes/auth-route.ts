import express, {Response, Request} from 'express'
import {RequestWithBody} from "../models/common";
import {InputAuthModel} from "../models/auth/input/input-auth-model";
import {AuthService} from "../services/auth.service";
import {authValidator} from "../validators/login-validator";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";

export const authRoute = express.Router()

authRoute.post('/login', authValidator(), async (req: RequestWithBody<InputAuthModel>, res: Response) => {

    const token: string | false = await AuthService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!token) return res.sendStatus(401)

    const tokenObject = {
        accessToken: token
    }

    return res.status(200).json(tokenObject)

})

authRoute.get('/me', accessTokenGuard, async (req: Request, res: Response) => {

})