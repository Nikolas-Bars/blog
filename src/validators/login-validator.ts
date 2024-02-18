import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";
import {usersCollection} from "../db/db";

const authPasswordValidator = body('password')
    .isString().withMessage('incorrect login or password').trim().isLength({min: 6, max: 20}).withMessage('incorrect login or password')

const codeValidator = body('code').isString().withMessage('incorrect code').custom(async (code) => {
    const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})

    if (user && user.emailConfirmation && user.emailConfirmation.isConfirmed) {

        throw new Error('code already been applied')

    } else if (user && user.emailConfirmation && user.emailConfirmation.expirationDate < new Date()) {

        throw new Error('code expired')

    }
})

const emailValidator = body('email').isEmail().withMessage('incorrect email').custom(async (email) => {
    const user = await usersCollection.findOne({email: email})

    if (user && user.emailConfirmation && user.emailConfirmation.isConfirmed) {

        throw new Error('email already been applied')

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