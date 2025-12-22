import express from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {LikesHistoryControllerInstance, UserControllerInstance} from "../composition-root";

export const likesHistoryRoute = express.Router()

likesHistoryRoute.post('/', LikesHistoryControllerInstance.createLike.bind(LikesHistoryControllerInstance))