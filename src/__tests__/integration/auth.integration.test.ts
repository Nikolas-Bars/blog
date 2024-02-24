import {MongoMemoryServer} from 'mongodb-memory-server'
import dotenv from "dotenv";
import {AuthService} from "../../services/auth.service";
import {testSeeder} from "../test.seeder";
import {emailAdapter} from "../../adapter/email-adapter";
import {emailServiceMock} from "../mocs";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../../db/db";

dotenv.config()


describe('AUTH-INTEGRATION', () => {

    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create()
        process.env.MONGO_URI = mongoServer.getUri()

    })

    beforeEach(async ()=> {
        await blogsCollection.deleteMany({})

        await postsCollection.deleteMany({})

        await usersCollection.deleteMany({})

        await commentsCollection.deleteMany({})
    })
    //
    // afterAll(async () => {
    //     await db.drop()
    //     await db.stop()
    // })

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