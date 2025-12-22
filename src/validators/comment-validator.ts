import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";

const contentValidator = body('content')
    .isString().withMessage('content must be string type').trim().isLength({min: 20, max: 300}).withMessage('incorrect content value')

export const commentValidator = () => {
    return [contentValidator, inputValidatorMiddleware]
}