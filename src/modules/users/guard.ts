import {
    CanActivate,
    createParamDecorator,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './service'

export const AuthedUser = createParamDecorator((data, req: Request) => req.user)

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const raw_header = (req.header('Authorization') || '').split(' ')

        if (raw_header.length != 2) throw new UnauthorizedException()

        switch (raw_header[0].toLowerCase()) {
            case 'basic': {
                const decoded_data = new Buffer(raw_header[1], 'base64').toString()
                const split = decoded_data.indexOf(':')
                const name = decoded_data.substring(0, split)
                const password = decoded_data.substring(split + 1)
                req.user = await this.userService.authenticate({name, password})
                return true
            }
            case 'bearer': {
                const token = raw_header[1]
                req.user = this.userService.authenticateByToken(token)
                return true
            }
            default: {
                throw new UnauthorizedException()
            }
        }
    }
}
