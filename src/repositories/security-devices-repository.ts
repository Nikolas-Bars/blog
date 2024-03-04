import {securityDevicesSessionCollection, usersCollection} from "../db/db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {UserDbType} from "../models/users/db/user-db";
import {OutputUser} from "../models/users/output/output-user";
import {SecurityDbType} from "../models/securityDevices/securityDbType";

export type MeDataType = {
    email: string
    login: string
    userId: string
}

export class SecurityDevicesRepository {

    static async CreateSession(session: SecurityDbType) {
        try {

            console.log(session, 'session')

            await securityDevicesSessionCollection.deleteMany({ip: session.ip})

            const result = await securityDevicesSessionCollection.insertOne(session)

        } catch(e) {

            console.error(e)
            return null

        }

    }

    static async getSessions(userId: string) {
        try {

            const result = await securityDevicesSessionCollection.find({userId: userId}).toArray()

            return result.map((el) => {
                return {
                    ip: el.ip,
                    title: el.title,
                    lastActiveDate: el.lastActiveDate,
                    deviceId: el.deviceId
                }
            })

        } catch(e) {

            return null

        }
    }

    static async sessionExists(deviceId:  string, userId: string, iat: string) {
        try {

            const result = await securityDevicesSessionCollection.findOne({ deviceId: deviceId, issueAt: iat, userId: userId })

            if (!result) return null

            return result

        } catch(e) {

            console.error(e)
            return null

        }
    }

    static async updateSession(deviceId: string, iat: string) {
        try {

            const lastActiveDate = new Date().toISOString()

            const result = await securityDevicesSessionCollection.updateOne({deviceId: deviceId}, {$set: {
                issueAt: iat, lastActiveDate: lastActiveDate

            }})

        } catch (e) {

        }
    }

    static async getSessionByDeviceId(deviceId: string): Promise<SecurityDbType | null> {
        try {

            const result = await securityDevicesSessionCollection.findOne({ deviceId: deviceId })

            if(!result) return null

            return result

        } catch (e) {

            console.error(e)

            return null

        }
    }
}