import {Response, Request, NextFunction} from 'express'
import {JWTService} from "../services/JWT.service";
import {UserService} from "../services/user.service";
import {blackListRefreshCollection, usersCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {SessionServices} from "../services/session.service";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const refreshToken = req.cookies.refreshToken
    // проверяем что он еще действует
    const payload: any = await JWTService.verifyRefreshToken(refreshToken)

    const black = await blackListRefreshCollection.findOne({token: refreshToken})

    console.log(payload, '1212121', black, 'cscscs')

    if (payload && !black) {

        const deviceId = payload.deviceId

        const userId = payload.userId.toString()

        const deviceName = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown'

        const session = await SessionServices.isSessionExists(deviceId, userId, payload.iat, deviceName!)

        console.log(deviceId, userId, payload.iat, deviceName, session,  'session')

        if (!session) return res.sendStatus(401)

        const user = await usersCollection.findOne({_id: new ObjectId(userId)})

        if (!user) return res.sendStatus(401)

        else {
            req.userId = userId
            req.deviceId = deviceId
        }

        await blackListRefreshCollection.insertOne({token: refreshToken})

        return next()
    }

    return res.sendStatus(401)

}