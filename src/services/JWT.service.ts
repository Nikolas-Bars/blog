import {config} from 'dotenv'
import jwt, {JwtPayload} from 'jsonwebtoken'

config()

export class JWTService {
    static async createToken(userId: string): Promise<string> {

        const a = jwt.sign({userId: userId}, process.env.JWT_SECRET || '111111111111111111', {expiresIn: '10h'})

        return a

    }
    static async createRefreshToken(userId: string, deviceId: string): Promise<string> {

        return jwt.sign({userId: userId, deviceId: deviceId}, process.env.JWT_REFRESH_SECRET || '222222222222222222', {expiresIn: '20h'})

        // return newToken

    }
    static async decodeToken(token: string): Promise<JwtPayload | string | null> {

        try {

            return jwt.decode(token)

        } catch (e) {

            console.error('Can`t decode token')

            return null
        }
    }

    static async verifyToken(token: string) {
        try {

            const result: any = jwt.verify(token, process.env.JWT_SECRET || '111111111111111111')
            
            return result

        } catch(e) {

            console.error(e)

            return null

        }
    }

    static async verifyRefreshToken (refreshToken: string) {
        try {

            const result: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '222222222222222222')

            return result

        } catch (e) {

            console.error(e)

            return null

        }

    }
}