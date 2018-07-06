import { Module } from '@nestjs/common'
import { UserModule } from '../users'
import { BackgroundsAdminController } from './admincontroller'
import { BackgroundsController } from './controller'


@Module({
    controllers: [BackgroundsController, BackgroundsAdminController],
    imports: [UserModule]
})
export class BackgroundsModule {
}
