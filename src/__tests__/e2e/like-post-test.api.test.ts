import request from "supertest";
import {app} from "../../app";
import {CreateUsers} from "../utils/users-utils";
import mongoose from "mongoose";

describe('/posts', () => {
    // вызываем эндпоинт который зачистит стартовые данные
    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')

    })

    it('should be created new user', async () => {

        // создаем трех пользователей

        const users = await CreateUsers(app, 5)

        expect(users).toHaveLength(3)

    })
})