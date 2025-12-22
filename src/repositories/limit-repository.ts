import {RequestHistoryModel} from "../db/db";
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
            // worked
            const result = await RequestHistoryModel.insertMany([data])

            if (!result) return null

            return result ? result[0]._id.toString() : null

        } catch (e) {

            return null

        }
    }

    static async check(data: RequestHistoryDbType): Promise<number | null> {
        try {
            // worked
            return await RequestHistoryModel.countDocuments({ip: data.ip, url: data.url, date: {$gte: data.date}})

        } catch (e) {
            return null
        }
    }
}