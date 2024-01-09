import express from "express"
import {blogRoute} from "./routes/blog-route";

export const app = express()

app.use(express.json())

app.use('/blog', blogRoute)