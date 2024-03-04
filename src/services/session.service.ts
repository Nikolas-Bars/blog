import {v1} from "uuid";
import {SecurityDevicesRepository} from "../repositories/security-devices-repository";
import {SecurityDbType} from "../models/securityDevices/securityDbType";

export class SessionServices {
    static async CreateSession(session: SecurityDbType) {
        try {

            await SecurityDevicesRepository.CreateSession(session)

        } catch(e) {

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

    static async isSessionExists(deviceId:  string, userId: string, iat: string) {
        try {

            const  result = await SecurityDevicesRepository.sessionExists(deviceId, userId, iat)

            if (!result) return null

            return result

        } catch(e) {

            console.error(e)
            return null

        }
    }
}