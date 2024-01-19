import {app} from "../../app";
import request from 'supertest'

describe('/posts', () => {
    // вызываем эндпоинт который зачистит стартовые данные
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    it('should be return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
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

        expect(posts.body).toEqual([])
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