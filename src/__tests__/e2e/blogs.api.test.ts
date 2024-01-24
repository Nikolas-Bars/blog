import {app} from "../../app";
import request from 'supertest'

describe('/blogs', () => {
    // вызываем эндпоинт который зачистит стартовые данные
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    it('should be return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('should be return status 404', async () => {
        await request(app)
            .get('/blog/123')
            .expect(404)
    })

    it('should be created new blog', async () => {

        const bodyData = {
            name: "new blog name",
            description: "description blog",
            websiteUrl: "https://Ybe4GR04dovOKHUOnbfOFRp5DgQwb18TtTqfPN3KdbHiND6I7F57zwpbvBC.KPy4jZVyoEqNpr4s1jMoOhoGYeE0mkpc",
            isMembership: false
        }
        const response = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(bodyData)
            .expect(201)

        const createdBlog = response.body

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: "new blog name",
            description: "description blog",
            websiteUrl: "https://Ybe4GR04dovOKHUOnbfOFRp5DgQwb18TtTqfPN3KdbHiND6I7F57zwpbvBC.KPy4jZVyoEqNpr4s1jMoOhoGYeE0mkpc",
            isMembership: expect.any(Boolean),
            createdAt: expect.any(String)
        })

        expect.setState({ blogId: createdBlog.id })

        const getBlogsResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const blogs = getBlogsResponse.body

        expect(blogs).toHaveLength(1)
    })

    it('should be receive an object with a list of errors during post request', async () => {
        const bodyData = {
            name: "     ",
            websiteUrl: "incorrect url"
        }

        const response = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(bodyData)
            .expect(400)

        const responseData = response.body

        expect(responseData).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                },
            ]
        })
    })

    it('should be return 401', async () => {
        await request(app)
            .post('/blogs')
            .expect(401)
    })

    it('blog should be updated', async () => {

        const { blogId } = expect.getState()

        const newBlogsData = {
            name: "super blog name",
            description: "description blog",
            websiteUrl: "https://youtube.KPy4jZVyoEqNpr4s1jMoOhoGYeE0mkpc",
            isMembership: false,
        }

        await request(app)
            .put(`/blogs/${blogId}`)
            .auth('admin', 'qwerty')
            .send(newBlogsData)
            .expect(204)
    })

    it('should be receive an object with a list of errors during update', async () => {
        const { blogId } = expect.getState()

        const newBlogsData = {
            name: "     ",
            description: "",
        }

        const response = await request(app)
            .put(`/blogs/${blogId}`)
            .auth('admin', 'qwerty')
            .send(newBlogsData)
            .expect(400)

        const responseData = response.body

        expect(responseData).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                },
            ]
        })
    })

    it('should be delete blog by id', async () => {
        const { blogId } = expect.getState()

        await request(app)
            .delete(`/blogs/${blogId}`)
            .auth('admin', 'qwerty')
            .expect(204)
        const blogs = await request(app)
            .get(`/blogs/${blogId}`)
            .expect(404)

        expect(blogs.body).toEqual({})
    })

    it('should be get 404 status', async () => {

        await request(app)
            .delete("/blogs/123")
            .auth('admin', 'qwerty')
            .expect(404)

    })
})