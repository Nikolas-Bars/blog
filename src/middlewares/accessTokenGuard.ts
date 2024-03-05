import {Response, Request, NextFunction} from 'express'
import {JWTService} from "../services/JWT.service";
import {UserService} from "../services/user.service";

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.headers || !req.headers.authorization) return res.sendStatus(401)

    const token = req.headers.authorization.split(' ')[1]

    const payload: any = await JWTService.verifyToken(token)

    console.log(payload, 'payload1')

    if (payload) {

        const userId = payload.userId.toString()

        const user: boolean = await UserService.doesExistsById(userId)

        console.log(user, 'payload2')

        if (!user) return res.sendStatus(401)

        else req.userId = userId

        return next()
    }

    return res.sendStatus(401)

}