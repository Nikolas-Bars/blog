import dotenv from "dotenv";
import {AuthService} from "../../services/auth.service";
import {testSeeder} from "../test.seeder";
import {emailAdapter} from "../../adapter/email-adapter";
import mongoose from 'mongoose'
import {BlogsModel, CommentsModel, PostsModel, UsersModel} from "../../db/db";

dotenv.config()


describe('AUTH-INTEGRATION', () => {

    const mongoURI = 'mongodb://localhost:27017/'

    beforeAll(async () => {

        await mongoose.connect(mongoURI)

    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    beforeEach(async ()=> {

        await BlogsModel.deleteMany({})

        await PostsModel.deleteMany({})

        await UsersModel.deleteMany({})

        await CommentsModel.deleteMany({})
    })

    describe('User Registration', () => {
        const registerUser = AuthService.registerUser

        emailAdapter.sendEmail = jest.fn().mockImplementation((email: string, subject: string, message: string) => {
            return 'message number'
        })

        it('should be register user with correct data', async () => {

            const { login, password, email } = testSeeder.createUserDto()

            const result = await registerUser({ login, password, email })

            expect(result).toBe("message number")

            expect(emailAdapter.sendEmail).toBeCalled()

        })
    })

})