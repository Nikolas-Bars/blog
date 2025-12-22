import {app} from "./app";
import {port, runDb} from "./db/db";

app.set('trust proxy', true)

app.listen(port, async () => {
    await runDb()
})