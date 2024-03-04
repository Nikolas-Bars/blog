import express, {Response, Request} from 'express'
import {RequestWithBody} from "../models/common";
import {InputAuthModel, RegistrationDataType} from "../models/auth/input/input-auth-model";
import {AuthService} from "../services/auth.service";
import {authValidator, confirmationValidator, resendingValidator} from "../validators/login-validator";
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {registrationValidator} from "../validators/registration-validator";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {UserService} from "../services/user.service";
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";

export const authRoute = express.Router()

authRoute.post('/login', authValidator(), rateLimitMiddleware, async (req: RequestWithBody<InputAuthModel>, res: Response) => {

    const ip = req.header('x-forwarded-for') || req.socket.remoteAddress

    const deviceName =  req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown'

    const tokens: { accessToken:string, refreshToken: string } | null = await AuthService.login(req.body.loginOrEmail, req.body.password, deviceName!, ip)

    if (!tokens) return res.sendStatus(401)

    const tokenObject = {
        accessToken: tokens.accessToken
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })

    return res.status(200).json(tokenObject)

})

authRoute.post('/refresh-token', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const tokens: { accessToken:string, refreshToken: string } | null = await AuthService.updateTokens(req.userId, req.deviceId)

    if (!tokens) return res.sendStatus(401)

    const tokenObject = {
        accessToken: tokens.accessToken
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })

    return res.status(200).json(tokenObject)

})

authRoute.post('/logout', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const clear = await UserService.deleteRefreshTokenByUserId(req.userId)

    res.clearCookie('refreshToken');

    if (!clear) return res.sendStatus(401)

    return res.sendStatus(204)

})

authRoute.post('/registration', registrationValidator(), async (req: Request, res: Response) => {
    const data: RegistrationDataType = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    }

    const result = await AuthService.registerUser(data)

    if (result) return res.sendStatus(204)

    else return res.sendStatus(400)

})

authRoute.post('/registration-confirmation', confirmationValidator(), async (req: Request, res: Response) => {

    const code = req.body.code

    const result = await AuthService.confirmEmail(code)

    if (!result) return res.sendStatus(400)

    else return res.sendStatus(204)

})

authRoute.post('/registration-email-resending', resendingValidator(), async (req: Request, res: Response) => {

    const email = req.body.email

    const result: string | null = await AuthService.resendConfirmationCode(email)

    if (!result) res.sendStatus(400)

    else return res.sendStatus(204)

})

authRoute.get('/me', accessTokenGuard, async (req: Request, res: Response) => {

    const id = req.userId

    const result = await AuthService.getMeData(id)

    if (!result) return res.sendStatus(204)

    return res.status(200).send(result)

})