import {app} from "../../app";
import request from 'supertest'
import {OutputPostModel} from "../../models/posts/output/output-post";
import mongoose from "mongoose";

describe('/posts', () => {
    // вызываем эндпоинт который зачистит стартовые данные
    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')

    })

    it('should be return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should be return status 404', async () => {
        await request(app)
            .get('/posts/123')
            .expect(404)
    })

    it('should be created new post', async () => {

        const blogBodyData = {
            name: "new blog name",
            description: "description blog",
            websiteUrl: "https://Ybe4GR04dovOKHUOnbfOFRp5DgQwb18TtTqfPN3KdbHiND6I7F57zwpbvBC.KPy4jZVyoEqNpr4s1jMoOhoGYeE0mkpc"
        }
        const responseBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(blogBodyData)
            .expect(201)

        const postBodyData = {
            title: "post title",
            shortDescription: "shortDescription for post",
            content: "some content",
            blogId: responseBlog.body.id,
        }

        const responsePost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(postBodyData)
            .expect(201)

        const createdPost = responsePost.body

        expect(createdPost).toEqual({
            ...postBodyData,
            id: expect.any(String),
            blogName: "new blog name",
            createdAt: expect.any(String)
        })

        expect.setState({ blogIdForPost: responseBlog.body.id.toString(), postId: createdPost.id.toString() })
    })

    it('should be get array with two error`s object', async () => {

        const postData =  {
            title: "post title",
            shortDescription: 534534553,
            content: "some content",
            blogId: 'incorrect blogId',
        }

        const response = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(postData)
            .expect(400)


        expect(response.body).toEqual({
            errorsMessages: [
                { message: expect.any(String), field: "shortDescription" },
                { message: expect.any(String), field: "blogId" }
            ]
        })
    })

    it('should be get post by id', async () => {

        const { postId, blogIdForPost } = expect.getState()

        const response = await request(app)
            .get(`/posts//${postId}`)
            .expect(200)

        const post = response.body

        expect(post).toEqual({
            id: expect.any(String),
            title: "post title",
            shortDescription: "shortDescription for post",
            content: "some content",
            blogId: blogIdForPost,
            blogName: "new blog name",
            createdAt: expect.any(String)
        })
    })

    it('post should be updated', async () => {

        const { postId, blogIdForPost } = expect.getState()

        const newPostData = {
            title: "new super post title",
            shortDescription: "shortDescription post new",
            content: "content updated",
            blogId: blogIdForPost
        }

        await request(app)
            .put(`/posts/${postId}`)
            .auth('admin', 'qwerty')
            .send(newPostData)
            .expect(204)
    })

    it('should be delete post by id', async () => {
        const { postId } = expect.getState()

        await request(app)
            .delete(`/posts/${postId}`)
            .auth('admin', 'qwerty')
            .expect(204)
        const posts = await request(app)
            .get('/posts')
            .expect(200)

        expect(posts.body.items.some((el: OutputPostModel) => el.id === postId)).toEqual(false)
    })

    it('should be receive an object with a list of errors during update post', async () => {
        const { postId, blogIdForPost } = expect.getState()

        const newPostData = {
            title: "    ",
            content: "     ",
            blogId: 123
        }

        const response = await request(app)
            .put(`/posts/${postId}`)
            .auth('admin', 'qwerty')
            .send(newPostData)
            .expect(400)

        const responseData = response.body

        expect(responseData).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                },
                {
                    message: expect.any(String),
                    field: 'content'
                },
                {
                    message: expect.any(String),
                    field: 'blogId'
                },
            ]
        })
    })
})