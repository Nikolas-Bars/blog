import {app} from "../../app";
import request from 'supertest'
import {CreateUsers} from "../utils/users-utils";
import mongoose from "mongoose";

describe('/users', () => {

    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')

    })

   it('should be get users paginated list', async () => {

       await CreateUsers(app, 5)

       const result = await request(app)
           .get('/users')
           .query({
               sortBy: 'createdAt',
               sortDirection: 'desc',
               pageNumber: 1,
               pageSize: 10,
               searchLoginTerm: 'ivanobla2',
               searchEmailTerm: 'test4@gmail.ru'
           })

       expect(result.body).toEqual({
           pagesCount: 1,
           page: 1,
           pageSize: 10,
           totalCount: 2,
           items: expect.any(Array)
       })

       expect(result.body.items).toHaveLength(2);
   })

    it('should be created new user', async () => {

        const data = {
            login: "ivanobla",
            password: "string",
            email: "dd@gmail.ru"
        }

        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(data)
            .expect(201)

        expect(result.body).toEqual({
            id: expect.any(String),
            login: "ivanobla",
            email: 'dd@gmail.ru',
            createdAt: expect.any(String)
        })

        expect.setState({ id: result.body.id })
    })

    it('should be delete user by id', async () => {

        const { id } = expect.getState()

        const result = await request(app)
            .delete(`/users/${id}`)
            .auth('admin', 'qwerty')
            .expect(204)
            .auth('admin', 'qwerty')
    })

    it('should be get errors array - email, password and login', async () => {

        const data = {
            login: "z",
            password: "s",
            email: "blaru"
        }

        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(data)
            .expect(400)

        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "login"
                },
                {
                    message: expect.any(String),
                    field: "password"
                },
                {
                    message: expect.any(String),
                    field: "email"
                }
            ]
        })
    })
})