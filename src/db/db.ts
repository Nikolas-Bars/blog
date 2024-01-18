import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogDb} from "../models/blogs/db/blog-db";

dotenv.config()
// указываем порт
export const port = process.env.PORT || 3007
// указываем ссылку для коннекта к базе
const uri = process.env.MONGO_URI || "mongodb+srv://docummagic0:481516Lost@cluster0.sfhnzph.mongodb.net/\n"

const client = new MongoClient(uri)
// указываем к какой конкретно базе коннектимся
const dataBase = client.db('blogs-db')
// выбираем нужные коллекции с которыми будем работать
export const blogsCollection = dataBase.collection<BlogDb>('blogs')

export const postsCollection = dataBase.collection('posts')

export const runDb = async () => {
    try {
        // при запуске функции коннктимся MongoDb
        await client.connect()
        console.log('Client connected to DB')
        console.log(console.log(`blog was started on ${port} port`))
    } catch (e) {
        console.error(e)
    }
}