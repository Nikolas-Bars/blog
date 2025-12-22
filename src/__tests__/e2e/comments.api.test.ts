import {app} from "../../app";
import request from 'supertest'
import mongoose from "mongoose";

describe('comments', () => {

    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

        await request(app)
            .delete('/testing/all-data')

    })

    it('should be create new blog, post, and loginIn', async () => {

        const data = {
            login: "comment",
            password: "string",
            email: "comm@gmail.ru"
        }

        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(data)
            .expect(201)

        expect(result.body).toEqual({
            id: expect.any(String),
            login: "comment",
            email: 'comm@gmail.ru',
            createdAt: expect.any(String)
        })

        expect.setState({ id: result.body.id })

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

        const loginData = {
            loginOrEmail: "comm@gmail.ru",
            password: "string"
        }

        const authData = await request(app)
            .post('/auth/login')
            .send(loginData)
            .expect(200)

        expect(authData.body).toEqual({
            accessToken: expect.any(String)
        })

        expect.setState({ blogIdForPost: responseBlog.body.id.toString(), postId: createdPost.id.toString(), token: authData.body.accessToken })

    })

    it('should be created new comment for post', async () => {

        const { token, postId } = expect.getState()

        const content = {content: 'content for ne comment: everybody lies!'}

        const result = await request(app)
            .post(`/posts/${postId}/comments`)
            .send(content)
            .set('authorization', `Bearer ${token}`)
            .expect(201)

        expect(result.body)
            .toEqual({
                id: expect.any(String),
                content: 'content for ne comment: everybody lies!',
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: 'comment'
                },
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None"
                },
                createdAt: expect.any(String)
            })

        expect.setState({ commentId: result.body.id })
    })

    it('should be get comment by commentId', async () => {

        const { commentId, token } = expect.getState()

        const result = await request(app)
            .get(`/comments/${commentId}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200)

        expect(result.body).toEqual({
            id: expect.any(String),
            content: 'content for ne comment: everybody lies!',
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: 'comment'
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None"
            },
            createdAt: expect.any(String)
        })
    })

    it ("should be delete comment by id", async () => {
        const { commentId, token } = expect.getState()

        await request(app)
            .delete(`/comments/${commentId}`)
            .set('authorization', `Bearer ${token}`)
            .expect(204)
    })
})