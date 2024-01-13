import {app} from "./app";


const port = process.env.PORT || 3005

app.listen(port, () => {
    console.log(`blog was started on ${port} port`)
})