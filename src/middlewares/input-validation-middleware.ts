import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const formattedError = validationResult(req).formatWith((error) => ({
        message: error.msg,
        field: error.type === "field" ? error.path : 'field not found'
    }))

    if (!formattedError.isEmpty()) {
        const errorMessage = formattedError.array({onlyFirstError: true})

        res.status(400).json({errorsMessages: errorMessage})

        return
    }

    return next()
}