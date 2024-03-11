import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";
import {BlogsModel} from "../db/db";
import {ObjectId} from "mongodb";

const titleValidator = body('title')
    .isString().withMessage('title must be string type').trim().isLength({min: 1, max: 30}).withMessage('incorrect length of title')

const shortDescriptionValidator = body('shortDescription')
    .isString().withMessage('shortDescription must be string type').trim().isLength({min: 1, max: 100}).withMessage('incorrect shortDescription value')

const contentValidator = body('content')
    .isString().withMessage('content must be string type').trim()
    .isLength({min: 1, max: 100}).withMessage('incorrect content')

const blogIdValidator = body('blogId').isString().withMessage('blogId must be string type')
    .isLength({min: 1}).withMessage('blogId is required field').custom(async (id: string) => {
        if(!ObjectId.isValid(id)){
            throw new Error('incorrect blogId')
        }

    const blog = await BlogsModel.findOne({_id: new ObjectId(id)})

    if (!blog) {
        throw new Error('incorrect blogId')
    }

    return true;

}).withMessage('incorrect blogId')

export const postValidator = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputValidatorMiddleware]
}

export const postFromBlogValidator = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, inputValidatorMiddleware]
}