import {body} from "express-validator";
import {BlogRepository} from "../repositories/blog-repository";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";

const titleValidator = body('title')
    .isString().withMessage('title must be string type').trim().isLength({min: 1, max: 30}).withMessage('incorrect length of title')

const shortDescriptionValidator = body('shortDescription')
    .isString().withMessage('shortDescription must be string type').trim().isLength({min: 1, max: 100}).withMessage('incorrect shortDescription value')

const contentValidator = body('content')
    .isString().withMessage('content must be string type')
    .isLength({min: 1, max: 100}).withMessage('incorrect content')

const blogIdValidator = body('blogId').custom((id: string) => {
    const blog = BlogRepository.getBlogById(id)

    if(!blog) {
        // проверь необходимость этих строк
        throw Error('incorrect blogId')
    }
    return true
}).withMessage('incorrect blogId')

export const postValidator = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputValidatorMiddleware]
}