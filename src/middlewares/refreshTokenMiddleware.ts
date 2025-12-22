import {NextFunction, Request, Response} from 'express'
import {JWTService} from "../services/JWT.service";
import {UsersModel} from "../db/db";
import {ObjectId} from "mongodb";
import {SessionServices} from "../services/session.service";
import {SecurityDbType} from "../models/securityDevices/securityDbType";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.cookies.refreshToken) return res.sendStatus(401)

    const refreshToken = req.cookies.refreshToken
    // проверяем что он еще действует
    const payload: any = await JWTService.verifyRefreshToken(refreshToken)

    if (payload) {

        const deviceId = payload.deviceId

        const userId = payload.userId.toString()

        // ТЕСТ
        const session: SecurityDbType | null = await SessionServices.isSessionExists(deviceId, userId)

        if (!session || session.issueAt !== payload.iat.toString()) {

            return res.sendStatus(401)
        }

        /////////////
        const user = await UsersModel.findOne({_id: new ObjectId(userId)})

        if (!user) return res.sendStatus(401)

        else {
            req.userId = userId
            req.deviceId = deviceId
        }

        return next()
    }

    return res.sendStatus(401)

}