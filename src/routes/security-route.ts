import express, {Request, Response} from 'express'
import {accessTokenGuard} from "../middlewares/accessTokenGuard";
import {SessionServices} from "../services/session.service";

export const securityRoute = express.Router()

securityRoute.get('/devices', accessTokenGuard, async (req: Request, res: Response) => {

    const result = await SessionServices.getSessions(req.userId)

    return res.status(200).json(result)

})

securityRoute.delete('/devices', accessTokenGuard, async (req: Request, res: Response) => {

    const result = await SessionServices.deleteAllSessions(req.userId)

    return result ? res.sendStatus(204) : res.status(400)
})