import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { UserModule } from '../users/module'
import { AuthMiddleware } from '../users/middleware'
import { BackgroundsController } from './controller'

@Module({
    controllers: [BackgroundsController],
    imports: [UserModule]
})
export class BackgroundsModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .forRoutes(
            { path: 'api/v1/backgrounds/*', method: RequestMethod.ALL },
        )
    }
}
