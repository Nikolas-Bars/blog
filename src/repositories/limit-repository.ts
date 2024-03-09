import {requestHistoryCollection} from "../db/db";
import {RequestHistoryDbType} from "../models/requestHistory/requestHistoryDbType";

type NewPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class LimitRepository {

    static async create(data: RequestHistoryDbType): Promise<string | null> {
        try {

            const result = await requestHistoryCollection.insertOne(data)

            if (!result) return null

            return result.insertedId.toString()

        } catch (e) {

            return null

        }
    }

    static async check(data: RequestHistoryDbType): Promise<number | null> {
        try {

            const result = await requestHistoryCollection.countDocuments({ip: data.ip, url: data.url, date: {$gte: data.date}})

            return result

        } catch (e) {
            return null
        }
    }
}