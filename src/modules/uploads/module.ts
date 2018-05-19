import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AuthMiddleware } from '../../auth.middleware'
import { UploadsController } from './controller'
import { UploadsRepository } from './repository'
import { UserService } from '../users/service'

@Module({
    controllers: [UploadsController],
    components: [UserService, UploadsRepository],
})
export class UploadsModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .with('users')
        .forRoutes(
            { path: 'api/v1/uploads', method: RequestMethod.ALL },
            { path: 'api/v1/uploads/:id', method: RequestMethod.DELETE }
        )
    }
}
