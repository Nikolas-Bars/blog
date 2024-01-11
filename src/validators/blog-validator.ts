import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";

const websiteUrlValidator = body('websiteUrl')
    .isString().withMessage('websiteUrl must be string type')
    .isLength({min: 1, max: 100}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('incorrect websiteUrl')

const nameValidator = body('name')
    .isString().withMessage('name must be string type').trim().isLength({min: 1, max: 15}).withMessage('incorrect length of name')

const descriptionValidator = body('description')
    .isString().withMessage('description must be string type').trim().isLength({min: 1, max: 500}).withMessage('incorrect description value')

export const blogValidator = () => {
    return [nameValidator, descriptionValidator, websiteUrlValidator, inputValidatorMiddleware]
}