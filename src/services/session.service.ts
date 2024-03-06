import {v1} from "uuid";
import {SecurityDevicesRepository} from "../repositories/security-devices-repository";
import {SecurityDbType} from "../models/securityDevices/securityDbType";

export class SessionServices {
    static async CreateSession(session: SecurityDbType) {
        try {

            return await SecurityDevicesRepository.CreateSession(session)

        } catch(e) {

            console.error(e)
            return null

        }
    }

    static async deleteAllSessions(userId: string, deviceId: string): Promise<boolean> {
        try {

            return await SecurityDevicesRepository.deleteAllSessions(userId, deviceId)

        } catch (e) {

            console.error(e)
            return false

        }
    }

    static async deleteOneSessions(deviceId: string): Promise<boolean> {
        try {

            return await SecurityDevicesRepository.deleteOneSessions(deviceId)

        } catch (e) {

            console.error(e)
            return false

        }
    }

    static async getSessionByDeviceId(deviceId: string): Promise<SecurityDbType | null> {
        try {

            return await SecurityDevicesRepository.getSessionByDeviceId(deviceId)

        } catch (e) {

            console.error(e)
            return null

        }
    }

    static async getSessions(userId: string) {
        try {

            return await SecurityDevicesRepository.getSessions(userId)

        } catch (e) {
            console.error(e)
            return null
        }
    }

    static async isSessionExists(deviceId:  string, userId: string) {
        try {

            const  result = await SecurityDevicesRepository.sessionExists(deviceId, userId)

            if (!result) return null

            return result

        } catch(e) {

            console.error(e)
            return null

        }
    }
}