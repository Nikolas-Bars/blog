import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";

const authPasswordValidator = body('password')
    .isString().withMessage('incorrect login or password').trim().isLength({min: 6, max: 20}).withMessage('incorrect login or password')


export const authValidator = () => {
    return [authPasswordValidator, inputValidatorMiddleware]
}