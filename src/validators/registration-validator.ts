import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";
import {UsersModel} from "../db/db";
import {UserRepository} from "../repositories/user-repository";

const loginValidator = body('login')
    .isString().withMessage('login must be string type').trim().isLength({min: 3, max: 10}).withMessage('incorrect length of login')
    .custom(async (login) => {
        const user = await UsersModel.findOne({login: login})

        if (!user) {
            return true;

        } else {
            throw new Error('login exists in system')
        }
    }).withMessage('login exists in system')

const passwordValidator = body('password')
    .isString().withMessage('password must be string type').trim().isLength({min: 6, max: 20}).withMessage('incorrect password length')

const newPasswordValidator = body('newPassword')
    .isString().withMessage('new password must be string type').trim().isLength({min: 6, max: 20}).withMessage('incorrect new password length')

const emailValidator = body('email')
    .isString().withMessage('email must be string type').trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .notEmpty().isEmail().withMessage('incorrect email value')
    .custom(async (email) => {
        const user = await UsersModel.findOne({ email: email })

        if (!user) {
            return true;

        } else {
            throw new Error('email exists in system')
        }
    }).withMessage('email exists in system')

const recoveryCodeValidator = body('recoveryCode')
    .isString().withMessage('recoveryCode must be string type').trim()
    .notEmpty().withMessage('incorrect recoveryCode value')
    .custom(async (recoveryCode) => {

        const user = await UserRepository.getUserByRecoveryCode(recoveryCode)

        if (user) {
            return true;

        } else {
            throw new Error('incorrect recoveryCode')
        }
    }).withMessage('incorrect recoveryCode')


const emailRecoveryValidator = body('email')
    .isString().withMessage('email must be string type').trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .notEmpty().isEmail().withMessage('incorrect email value')

export const registrationValidator = () => {
    return [loginValidator, passwordValidator, emailValidator, inputValidatorMiddleware]
}

export const emailRegisterValidator =()=> {
    return [emailRecoveryValidator, inputValidatorMiddleware]
}

export const passwordRegisterValidator =()=> {
    return [newPasswordValidator, recoveryCodeValidator, inputValidatorMiddleware]
}