import {NextFunction, Response} from "express";
import {RequestWithBody} from "../models/common";
import {InputAuthModel} from "../models/auth/input/input-auth-model";
import {UserRepository} from "../repositories/user-repository";
import {LimitService} from "../services/limit.service";

export const rateLimitMiddleware = async (req: RequestWithBody<InputAuthModel>, res: Response, next: NextFunction) => {

    const url = req.originalUrl

    console.log(req.ip, 'ipipipip')

    const ip = req.header('x-forwarded-for') || req.socket.remoteAddress || '127.001'

    const user = await UserRepository.findByLoginOrEmail(req.body.loginOrEmail)

    if(!user) return res.sendStatus(401)

    const currentDate = new Date();

    const date = currentDate.getTime()

    const dateForCompare = currentDate.getTime() + 10000

    const currentCountRequests = await LimitService.checkAndCreate({date: date.toString(), userId: user._id.toString(), url, ip: ip}, dateForCompare)

    if (currentCountRequests === null) return res.sendStatus(429)

    return next()
}