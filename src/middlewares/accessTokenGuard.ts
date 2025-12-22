import {Response, Request, NextFunction} from 'express'
import {JWTService} from "../services/JWT.service";
import {UserService} from "../composition-root";
import {OutputUser} from "../models/users/output/output-user";


export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.headers || !req.headers.authorization) return res.sendStatus(401)

    const token = req.headers.authorization.split(' ')[1]

    const payload: any = await JWTService.verifyToken(token)

    if (payload) {

        const userId = payload.userId

        const user: OutputUser | null = await UserService.doesExistsById(userId)

        if (!user) return res.sendStatus(401)
        req.login = user.login
        req.userId = userId

        return next()
    }

    return res.sendStatus(401)

}

export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const token = req.cookies.refreshToken

    const payload: any = await JWTService.verifyRefreshToken(token)

    if (payload) {

        const userId = payload.userId

        const user: OutputUser | null = await UserService.doesExistsById(userId)

        if (!user) return res.sendStatus(401)

        req.userId = userId

        req.deviceId = payload.deviceId

        return next()
    }

    return res.sendStatus(401)

}