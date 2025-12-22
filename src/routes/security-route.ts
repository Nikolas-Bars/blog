import express, {Request, Response} from 'express'
import {accessTokenGuard, refreshTokenGuard} from "../middlewares/accessTokenGuard";
import {SessionServices} from "../services/session.service";

export const securityRoute = express.Router()

securityRoute.get('/devices', refreshTokenGuard, async (req: Request, res: Response) => {

    const result = await SessionServices.getSessions(req.userId)

    return res.status(200).json(result)

})

securityRoute.delete('/devices', refreshTokenGuard, async (req: Request, res: Response) => {

    const result = await SessionServices.deleteAllSessions(req.userId, req.deviceId)

    return result ? res.sendStatus(204) : res.status(400)
})

securityRoute.delete('/devices/:deviceId', refreshTokenGuard, async (req: Request, res: Response) => {

    const session = await SessionServices.getSessionByDeviceId(req.params.deviceId)

    if (session && (session.userId !== req.userId)) {
        return res.sendStatus(403)
    }

    if (!session) {
        return res.sendStatus(404)
    }

    await SessionServices.deleteOneSessions(req.params.deviceId)

    return res.sendStatus(204)
})