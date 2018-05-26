import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AuthMiddleware } from './middleware'
import { UserController } from './controller'
import { UserService } from './service'
import { UserRepository } from './repository'

@Module({
    controllers: [UserController],
    components: [UserService, UserRepository],
    exports: [UserService, UserRepository]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .forRoutes(
            { path: 'api/v1/users/manage', method: RequestMethod.ALL },
        )
    }
}
