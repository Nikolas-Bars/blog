import {Response, Request, NextFunction} from 'express'
import {JWTService} from "../services/JWT.service";
import {UserService} from "../services/user.service";
import {usersCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const refreshToken = req.cookies.refreshToken
    // проверяем что он еще действует
    const payload: any = await JWTService.verifyRefreshToken(refreshToken)

    if (payload) {

        const userId = payload.userId.toString()

        const user = await usersCollection.findOne({_id: new ObjectId(userId)})

        if (!user || refreshToken !== user.refreshToken) return res.sendStatus(401)

        else req.userId = userId

        return next()
    }

    return res.sendStatus(401)

}