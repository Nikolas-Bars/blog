import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";
import {usersCollection} from "../db/db";

const loginValidator = body('login')
    .isString().withMessage('login must be string type').trim().isLength({min: 3, max: 10}).withMessage('incorrect length of login')
    .custom(async (login) => {
        const user = await usersCollection.findOne({login: login})
        if (!user) {
            return true;

        } else {
            throw new Error('login exists in system')
        }
    }).withMessage('login exists in system')

const passwordValidator = body('password')
    .isString().withMessage('shortDescription must be string type').trim().isLength({min: 6, max: 20}).withMessage('incorrect password length')

const emailValidator = body('email')
    .isString().withMessage('content must be string type').trim()
    .notEmpty().isEmail().withMessage('incorrect password email')
    .custom(async (email) => {
        const user = await usersCollection.findOne({email: email})
        if (!user) {
            return true;

        } else {
            throw new Error('email exists in system')
        }
    }).withMessage('email exists in system')

export const userCreateValidator = () => {
    return [loginValidator, passwordValidator, emailValidator, inputValidatorMiddleware]
}