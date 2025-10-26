import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // admin qwerty
    if(req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
        return
    }
    // return явно показывает, что это финальная операция middleware, но можно и без него и написать просто next()
    return next()
}
