import express from "express"
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {deleteAllDataRoute} from "./routes/test-delete-route";

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hello friends!!!')
})

app.use('/blogs', blogRoute)

app.use('/posts', postRoute)

app.use('/testing/all-data', deleteAllDataRoute)