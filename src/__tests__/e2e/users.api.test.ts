import {app} from "../../app";
import request from 'supertest'
import {OutputPostModel} from "../../models/posts/output/output-post";
import {UserDbType} from "../../models/users/db/user-db";
import {CreateUsers} from "../utils/users-utils";

describe('/users', () => {
    // вызываем эндпоинт который зачистит стартовые данные
    // beforeAll(async () => {
    //     await request(app)
    //         .delete('/testing/all-data')
    // })

   it('should be get users paginated list', async () => {

       await CreateUsers(app, 5)

       const result = await request(app)
           .get('/users')
           .query({
               sortBy: 'createdAt',
               sortDirection: 'desc',
               pageNumber: 1,
               pageSize: 10,
               searchLoginTerm: 'ivanov',
               searchEmailTerm: '@gmail.ru'
           })

       expect(result.body).toEqual({
           pagesCount: 1,
           page: 1,
           pageSize: 10,
           totalCount: 3,
           items: expect.any(Array)
       })

       expect(result.body.items).toHaveLength(3);
   })

    it('should be created new user', async () => {

        const data = {
            login: "ivanov bla",
            password: "string",
            email: "@gmail.ru"
        }

        const result = await request(app)
            .post('/users')
            .send(data)
            .expect(201)

        expect(result.body).toEqual({
            id: expect.any(String),
            login: "ivanov bla",
            email: '@gmail.ru',
            createdAt: expect.any(String)
        })

        expect.setState({ id: result.body.id })
    })

    it('should be delete user by id', async () => {

        const { id } = expect.getState()

        const result = await request(app)
            .delete(`/users/${id}`)
            .expect(204)

        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "password"
                },
                {
                    message: expect.any(String),
                    field: "login"
                },
                {
                    message: expect.any(String),
                    field: "email"
                }
            ]
        })
    })

    it('should be get errors array - email, password and login', async () => {

        const data = {
            login: "z",
            password: "s",
            email: "blaru"
        }

        const result = await request(app)
            .post('/users')
            .send(data)
            .expect(400)

        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "password"
                },
                {
                    message: expect.any(String),
                    field: "login"
                },
                {
                    message: expect.any(String),
                    field: "email"
                }
            ]
        })
    })
})