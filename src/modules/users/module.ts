import { Module } from '@nestjs/common'
import { UserAdminController } from './admincontroller'
import { UserController } from './controller'
import { AuthGuard } from './guard'
import { UserByIdPipe } from './pipe'
import { UserRepository } from './repository'
import { UserService } from './service'


@Module({
    controllers: [UserController, UserAdminController],
    providers: [UserService, UserRepository, AuthGuard, UserByIdPipe],
    exports: [UserService, UserRepository, AuthGuard, UserByIdPipe],
})
export class UserModule {
}
