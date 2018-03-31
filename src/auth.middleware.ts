import { ExpressMiddleware, HttpException, Inject, Middleware, NestMiddleware } from '@nestjs/common'
import { UserService } from './modules/users/service'
import { NextFunction, Request, Response } from 'express'

@Middleware()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    resolve(endpoint: string): ExpressMiddleware {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // TODO return WWW-Authenticate header with 401
            if (!await this.checkAuthHeader(req)) throw new HttpException('Not authorized', 401)
            next()
        }
    }

    protected checkAuthHeader(req: Request): Promise<string | boolean> {
        const raw_header = (req.header('Authorization') || '').split(' ')

        if (raw_header.length != 2) return (async () => false)()

        switch (raw_header[0]) {
            case 'Basic': {
                const decoded_data = new Buffer(raw_header[1], 'base64').toString()
                const split = decoded_data.indexOf(':')
                const name = decoded_data.substring(0, split)
                const password = decoded_data.substring(split + 1)
                return this.userService.authenticate({ name, password })
            }
            case 'Bearer': {
                const token = raw_header[1]
                return this.userService.authenticateByToken(token)
            }
            default: {
                return (async () => false)()
            }
        }
    }
}
