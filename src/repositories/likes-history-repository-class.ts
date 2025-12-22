import {LikesModel, UsersModel} from "../db/db";
import {UserDbType} from "../models/users/db/user-db";
import {CreateLikeInputModel} from "../models/likes/CreateLikeInputModel";

export class LikesHistoryRepositoryClass {

    async createLike(like: CreateLikeInputModel): Promise<string | null> {
        try {

            // worked

            const result = await LikesModel.insertMany([like])

            return result.length ? result[0]._id.toString() : null

        } catch (e) {

            console.error(e)

            return null

        }
    }

}

export const LikesRepository = new LikesHistoryRepositoryClass()