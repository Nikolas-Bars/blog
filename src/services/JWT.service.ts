import {config} from 'dotenv'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {ObjectId} from "mongodb";

config()

export class JWTService {
    static async createToken(userId: string): Promise<string> {

        console.log(process.env.JWT_SECRET, 'process.env.JWT_SECRET')

        return jwt.sign({userId: userId}, process.env.JWT_SECRET || '111111111111111111', {expiresIn: '1h'})

    }

    static async decodeToken(token: string) {

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
            
            return new ObjectId(result.userId)

        } catch(e) {

            console.error(e)

            return null

        }
    }
}