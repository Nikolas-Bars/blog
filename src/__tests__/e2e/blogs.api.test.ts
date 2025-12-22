import {app} from "../../app";
import request from 'supertest'
import {CreateBlogInputModel} from "../../models/blogs/input/create.blog.input.model";
import {OutputBlogType} from "../../models/blogs/output/blog-output-model";
import mongoose from "mongoose";

describe('/blogs', () => {
    // вызываем эндпоинт который зачистит стартовые данные

    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')
    })

    it('should be return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it('should be return status 404', async () => {
        await request(app)
            .get('/blog/123')
            .expect(404)
    })

    it('should be created new blog', async () => {

        const bodyData: CreateBlogInputModel = {
            name: "new blog name 1",
            description: "description blog",
            websiteUrl: "https://YbbvBC.KPy4jZVyoEqpc",
        }
        const response = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(bodyData)
            .expect(201)

        const createdBlog = response.body

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: "new blog name 1",
            description: "description blog",
            websiteUrl: "https://YbbvBC.KPy4jZVyoEqpc",
            isMembership: expect.any(Boolean),
            createdAt: expect.any(String)
        })

        expect.setState({ blogId: createdBlog.id })

        const getBlogsResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const blogs = getBlogsResponse.body

        expect(blogs.items.some((el: OutputBlogType) => el.name === 'new blog name 1')).toEqual(true)

    })

    it('should be created  new post for specific blog', async () => {

        const { blogId } = expect.getState()

        const postBodyData = {
            title: "post title",
            shortDescription: "post for specific blog",
            content: "some content"
        }

        const result = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .auth('admin', 'qwerty')
            .send(postBodyData)
            .expect(201)

        expect(result.body).toEqual({
            id: expect.any(String),
            title: "post title",
            shortDescription: "post for specific blog",
            content: expect.any(String),
            blogId: blogId,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
    })

    it('should be get paginated posts for specific blog', async () => {

        const { blogId } = expect.getState()

        const result = await request(app)
            .get(`/blogs/${ blogId }/posts?pageSize=100&pageNumber=1`)
            .expect(200)

        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 100,
            totalCount: 1,
            items: [
                {
                    id: expect.any(String),
                    title: "post title",
                    shortDescription: "post for specific blog",
                    content: expect.any(String),
                    blogId: blogId,
                    blogName: expect.any(String),
                    createdAt: expect.any(String)
                }
            ]
        })
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