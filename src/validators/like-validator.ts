import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validation-middleware";

const like = body('likeStatus').isString().custom(async (likeStatus) => {

    if (!likeStatus || !['None', 'Like', 'Dislike'].includes(likeStatus)) {
        throw new Error('incorrect type of likeStatus')
    }

})

export const likeValidator = () => {
    return [like, inputValidatorMiddleware]
}