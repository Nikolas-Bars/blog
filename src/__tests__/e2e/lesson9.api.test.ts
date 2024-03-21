import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

describe('/users', () => {

    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')

    })
    // beforeAll(async () => {
    //     await request(app)
    //         .delete('/testing/all-data')
    // })

    it('should be created new user', async () => {

        const data = {
            login: "Looser",
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
            login: "Looser",
            email: 'dd@gmail.ru',
            createdAt: expect.any(String)
        })

        expect.setState({ id: result.body.id })
    })

    it('should be login 4 times with different user agent', async () => {

        const data = {
            loginOrEmail: "dd@gmail.ru",
            password: "string",
        }

        // логиним одного пользователя 4 раза с разных браузеров и ip

        const session1 = await request(app)
            .post('/auth/login')
            .send(data)
            .set('User-Agent', `Browser1`)
            .set('x-forwarded-for', `::111:111`)
            .expect(200)

        expect(session1.body).toEqual({
            accessToken: expect.any(String)
        })

        const refreshToken1 = session1.headers['set-cookie'][0].split(';')[0].split('=')[1]

        /////////////////////////////////////////////////////////////////

        const session2 = await request(app)
            .post('/auth/login')
            .send(data)
            .set('User-Agent', `Browser2`)
            .set('x-forwarded-for', `::111:222`)
            .expect(200)

        expect(session2.body).toEqual({
            accessToken: expect.any(String)
        })

        const refreshToken2 = session2.headers['set-cookie'][0].split(';')[0].split('=')[1]

        /////////////////////////////////////////////////////////////////

        const session3 = await request(app)
            .post('/auth/login')
            .send(data)
            .set('User-Agent', `Browser3`)
            .set('x-forwarded-for', `::111:333`)
            .expect(200)

        expect(session3.body).toEqual({
            accessToken: expect.any(String)
        })

        const refreshToken3 = session3.headers['set-cookie'][0].split(';')[0].split('=')[1]

        /////////////////////////////////////////////////////////////////

        const session4 = await request(app)
            .post('/auth/login')
            .send(data)
            .set('User-Agent', `Browser4`)
            .set('x-forwarded-for', `::111:444`)
            .expect(200)

        expect(session4.body).toEqual({
            accessToken: expect.any(String)
        })

        const refreshToken4 = session4.headers['set-cookie'][0].split(';')[0].split('=')[1]

        /////////////////////////////////////////////////////////////////


        // Обновляем refreshToken девайса 1;

        const refreshResult = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', `refreshToken=${refreshToken1}`)
            .set('User-Agent', `Browser1`)
            .expect(200)

        expect(refreshResult.body).toEqual({
            accessToken: expect.any(String)
        })

        let newRefreshToken = refreshResult.headers['set-cookie'][0].split('=')[1]

        expect.setState({ token: refreshResult.body.accessToken, refreshToken: newRefreshToken })

        const { token, refreshToken } = expect.getState()

        const get4Section = await request(app)
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(200)

        expect(get4Section.body).toHaveLength(4);

        const session2Data = get4Section.body.find((el: any) => el.title === 'Browser2')
        const session3Data = get4Section.body.find((el: any) => el.title === 'Browser3')
        const session1Data = get4Section.body.find((el: any) => el.title === 'Browser1')
        const session4Data = get4Section.body.find((el: any) => el.title === 'Browser4')

        //////////////////////////////////////////////////

        await request(app) // Удаляем девайс 2 (передаем refreshToken девайса 1)
            .delete(`/security/devices/${session2Data.deviceId}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(204)

        const get3Sections = await request(app) // Запрашиваем список девайсов. Проверяем, что девайс 2 отсутствует в списке;
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', `Browser1`)
            .set('x-forwarded-for', `::111:111`)
            .expect(200)

        expect(get3Sections.body).toHaveLength(3);

        //////////////////////////////////////////////////// Делаем logout девайсом 3. Запрашиваем список девайсов (девайсом 1).  В списке не должно быть девайса 3;

        await request(app) // Делаем logout девайсом 3.
            .post('/auth/logout')
            .set('Cookie', `refreshToken=${refreshToken3}`)
            .set('User-Agent', `Browser3`)
            .set('x-forwarded-for', `::111:333`)
            .expect(204)

        const get2Sections = await request(app) // Запрашиваем список девайсов (девайсом 1).  В списке не должно быть девайса 3;
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', `Browser1`)
            .set('x-forwarded-for', `::111:111`)
            .expect(200)

       expect(get2Sections.body).toHaveLength(2);

        //////////////////////////////////////////////////////// Удаляем все оставшиеся девайсы (девайсом 1).

        await request(app)
            .delete(`/security/devices/${session4Data.deviceId}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(204)

        const get1Sections = await request(app) // Запрашиваем список девайсов. В списке должен содержаться только один (текущий) девайс;
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('User-Agent', `Browser1`)
            .set('x-forwarded-for', `::111:111`)
            .expect(200)

        expect(get1Sections.body).toHaveLength(1);

    })

})