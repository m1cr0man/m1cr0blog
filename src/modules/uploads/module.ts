import { Inject, MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AuthMiddleware, UserResolveMiddleware } from '../users/middleware'
import { UploadsController } from './controller'
import { UserService } from '../users/service'
import { UploadsRepository } from './repository'
import { UploadsService } from './service'
import { UserModule } from '../users/module'

@Module({
    controllers: [UploadsController],
    imports: [UserModule]
})
export class UploadsModule implements NestModule {
    constructor(
        @Inject(UserService)
        userService: UserService
    ) {
        // Set up expiry monitor
        // Runs every 5 minutes
        setInterval(() => {
            for (let user of userService.find()) {
                (new UploadsService(new UploadsRepository(user.id))).clean()
            }
        }, 1000 * 60 * 5)
    }

    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .forRoutes(
            { path: 'api/v1/uploads', method: RequestMethod.ALL },
            { path: 'api/v1/uploads/:id', method: RequestMethod.DELETE }
        )

        consumer.apply(UserResolveMiddleware)
        .forRoutes(
            { path: 'api/v1/uploads/:userId/:id', method: RequestMethod.ALL }
        )
    }
}
