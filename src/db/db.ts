import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogDb} from "../models/blogs/db/blog-db";
import {PostDbType} from "../models/posts/db/post-db";
import {UserDbType} from "../models/users/db/user-db";
import {CommentInputType} from "../models/comments/input/comment-input";

dotenv.config()
// указываем порт
export const port = process.env.PORT || 3010

// указываем ссылку для коннекта к базе
// локальная - mongodb://localhost:27017
// atlas "mongodb+srv://docummagic0:481516Lost@cluster0.sfhnzph.mongodb.net/"

const uri = process.env.MONGO_URI || "mongodb://localhost:27017"

const client = new MongoClient(uri)
// указываем к какой конкретно базе коннектимся
const dataBase = client.db('blogs-db')
// выбираем нужные коллекции с которыми будем работать
export const blogsCollection = dataBase.collection<BlogDb>('blogs')

export const postsCollection = dataBase.collection<PostDbType>('posts')

export const usersCollection = dataBase.collection<UserDbType>('users')

export const commentsCollection = dataBase.collection<CommentInputType>('users')

export const runDb = async () => {
    try {
        // при запуске функции коннктимся MongoDb
        await client.connect()
        console.log('Client connected to DB')
        console.log(console.log(`blog was started on ${port} port`))
    } catch (e) {
        console.error(e, 'runDb')
        await client.close()
    }
}