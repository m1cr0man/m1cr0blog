import {
    createRouteParamDecorator,
    ExpressMiddleware,
    HttpException,
    Inject,
    Middleware,
    NestMiddleware,
} from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { User } from './entity'
import { UserService } from './service'

export const AuthedUser = createRouteParamDecorator((data, req) => req.user)

@Middleware()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    resolve(endpoint: string): ExpressMiddleware {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // TODO return WWW-Authenticate header with 401
            const user = await this.checkAuthHeader(req)
            if (!user) throw new HttpException('Not authorized', 401)

            req.user = user
            next()
        }
    }

    protected checkAuthHeader(req: Request): Promise<User | false> {
        const raw_header = (req.header('Authorization') || '').split(' ')

        if (raw_header.length != 2) return (async (): Promise<false> => false)()

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
                return (async () => this.userService.authenticateByToken(token))()
            }
            default: {
                return (async (): Promise<false> => false)()
            }
        }
    }
}

@Middleware()
export class UserResolveMiddleware implements NestMiddleware {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    resolve(endpoint: string): ExpressMiddleware {
        return (req: Request, res: Response, next: NextFunction): void => {
            req.user = this.userService.findOne(req.params.userId)
            next()
        }
    }
}
