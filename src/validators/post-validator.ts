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

const blogIdValidator = body('blogId').isString().withMessage('shortDescription must be string type')
    .isLength({min: 1}).withMessage('blogId is required field').custom((id: string) => {
    const blog = BlogRepository.getBlogById(id)

    return blog !== 404;

}).withMessage('incorrect blogId')

export const postValidator = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputValidatorMiddleware]
}