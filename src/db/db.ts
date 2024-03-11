import dotenv from 'dotenv'
import {MongoClient, WithId} from "mongodb";
import {BlogDb} from "../models/blogs/db/blog-db";
import {PostDbType} from "../models/posts/db/post-db";
import {UserDbType} from "../models/users/db/user-db";
import {CommentInputType} from "../models/comments/input/comment-input";
import {SecurityDbType} from "../models/securityDevices/securityDbType";
import {RequestHistoryDbType} from "../models/requestHistory/requestHistoryDbType";
import mongoose from "mongoose";
import {CommentatorInfo} from "../models/comments/commentator-info/commentator-info";

dotenv.config()
// указываем порт
export const port = process.env.PORT || 3007

// указываем ссылку для коннекта к базе
// локальная - mongodb://localhost:27017
// atlas "mongodb+srv://docummagic0:481516Lost@cluster0.sfhnzph.mongodb.net/"

const uri = process.env.MONGO_URI || "mongodb://localhost:27017"

const client = new MongoClient(uri)
// указываем к какой конкретно базе коннектимся
const dataBase = client.db('blogsdb')
// выбираем нужные коллекции с которыми будем работать
export const usersCollection = dataBase.collection<UserDbType>('users')
export const blogsCollection = dataBase.collection<BlogDb>('blogs')
export const postsCollection = dataBase.collection<PostDbType>('posts')
export const commentsCollection = dataBase.collection<CommentInputType>('comments')
export const securityDevicesSessionCollection = dataBase.collection<SecurityDbType>('securitydevices')
export const requestHistoryCollection = dataBase.collection<RequestHistoryDbType>('requesthistory')
export const blackListRefreshCollection = dataBase.collection<any>('blacklistrefresh')
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



const usersSchema = new mongoose.Schema<UserDbType>({
    email: {type: String, required: true},
    login: {type: String, required: true},
    createdAt: String,
    password: String,
    salt: String,
    emailConfirmation: {
        // confirmationCode - код который уйдет пользователю
        confirmationCode: String,
        // expirationDate - дата когда код устареет
        expirationDate: Date,
        isConfirmed: Boolean
    }
});
const blogsSchema = new mongoose.Schema<BlogDb>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
    createdAt: {type: String, required: true},
});
const postsSchema = new mongoose.Schema<PostDbType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
});
const commentsSchema = new mongoose.Schema<CommentInputType>({
    content: {type: String, required: true},
    commentatorInfo: Object,
    postId: {type: String, required: true},
    createdAt: {type: String, required: true},
});
const securitySchema = new mongoose.Schema<SecurityDbType>({
    userId: String,
    issueAt: String,
    deviceId: String,
    lastActiveDate: String,
    title: String,
    ip: String,
});
const requestHistorySchema = new mongoose.Schema<WithId<RequestHistoryDbType>>({
    userId: {type: String, required: true},
    url: {type: String, required: true},
    ip: {type: String, required: true},
    date: {type: String, required: true}
});

export const BlogsModel = mongoose.model('blogs', blogsSchema);

export const UsersModel = mongoose.model('users', usersSchema);

export const PostsModel = mongoose.model('posts', postsSchema);

export const CommentsModel = mongoose.model('comments', commentsSchema);

export const SecurityModel = mongoose.model('security', securitySchema);

export const RequestHistoryModel = mongoose.model('requesthistory', requestHistorySchema);

export const runDb = async () => {
    try {
        // при запуске функции коннктимся MongoDb
        // await client.connect()

        await mongoose.connect(uri + 'blogsdb');

        console.log('Client connected to DB - ', uri + 'blogsdb')

        console.log(console.log(`blog was started on ${port} port`))

    } catch (e) {
        console.error(e, 'runDb')
        // await client.close()
        await mongoose.disconnect()
    }
}