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

            await securityDevicesSessionCollection.deleteMany({ip: session.ip})

            return await securityDevicesSessionCollection.insertOne(session)

        } catch(e) {

            console.error(e)
            return null

        }

    }

    static async deleteAllSessions(userId: string, deviceId: string): Promise<boolean> {
        try {

            const filter = { userId: userId, deviceId: { $ne: deviceId } };

            await securityDevicesSessionCollection.deleteMany(filter);

            return true

        } catch(e) {

            console.error(e)
            return false

        }
    }

    static async deleteOneSessions(deviceId: string): Promise<boolean> {
        try {

            const result = await securityDevicesSessionCollection.deleteOne({deviceId: deviceId})

            return true

        } catch(e) {

            console.error(e)
            return false

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

    static async sessionExists(deviceId:  string, userId: string) {
        try {

            const result = await securityDevicesSessionCollection.findOne({ deviceId: deviceId, userId: userId })

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

            await securityDevicesSessionCollection.updateOne({deviceId: deviceId}, {$set: {
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