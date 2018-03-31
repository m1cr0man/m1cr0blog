import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './controller'
import { UserService } from './service'
import { User } from './entity'
import { AuthMiddleware } from '../../auth.middleware'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    components: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .with('users')
        .forRoutes(
            { path: 'api/v1/users/manage', method: RequestMethod.ALL },
        )
    }
}
