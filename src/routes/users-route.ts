import express from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {registrationValidator} from "../validators/registration-validator";
import {UserControllerInstance} from "../composition-root";

export const userRoute = express.Router()

userRoute.post('/', authMiddleware, registrationValidator(), UserControllerInstance.createUser.bind(UserControllerInstance))

userRoute.get('/', UserControllerInstance.getUsers.bind(UserControllerInstance))

userRoute.delete('/:id', authMiddleware, UserControllerInstance.deleteUser.bind(UserControllerInstance))