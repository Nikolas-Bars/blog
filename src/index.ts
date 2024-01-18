import {app} from "./app";
import {port, runDb} from "./db/db";

app.listen(port, async () => {
    await runDb()
})