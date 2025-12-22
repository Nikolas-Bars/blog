import request from 'supertest'

export const CreateUsers = async (app: any, count: number) => {

    const users = []

    for (let i = 1; i <= count; i++) {
        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: `ivanobla${i}`,
                password: `string${i}`,
                email: `test${i}@gmail.ru`
            })
            .expect(201)

        users.push(result.body)
    }

    return users
}