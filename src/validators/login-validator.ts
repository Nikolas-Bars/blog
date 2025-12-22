import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";
import {UsersModel} from "../db/db";
import {UserDbType} from "../models/users/db/user-db";

const authPasswordValidator = body('password')
    .isString().withMessage('incorrect login or password').trim().isLength({min: 6, max: 20}).withMessage('incorrect login or password')

const codeValidator = body('code').isString().withMessage('incorrect code').custom(async (code) => {
    const user: UserDbType | null = await UsersModel.findOne({'emailConfirmation.confirmationCode': code})

    if (user && user.emailConfirmation && user.emailConfirmation.isConfirmed) {

        throw new Error('code already been applied')

    } else if (user && user.emailConfirmation && user.emailConfirmation.expirationDate < new Date()) {

        throw new Error('code expired')

    } else if (!user) {
        throw new Error('code does not exist')
    }
})

const emailValidator = body('email').isEmail().withMessage('incorrect email').custom(async (email) => {
    const user: UserDbType | null = await UsersModel.findOne({email: email})

    if (user && user.emailConfirmation && user.emailConfirmation.isConfirmed) {

        throw new Error('email already been applied')

    } if (!user) {
        throw new Error('user not found')
    }
})


export const authValidator = () => {
    return [authPasswordValidator, inputValidatorMiddleware]
}

export const confirmationValidator = () => {
    return [codeValidator, inputValidatorMiddleware]
}

export const resendingValidator = () => {
    return [emailValidator, inputValidatorMiddleware]
}