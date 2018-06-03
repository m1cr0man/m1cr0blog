import { Module } from '@nestjs/common'
import { UserModule } from '../users'
import { BackgroundsController } from './controller'

@Module({
    controllers: [BackgroundsController],
    imports: [UserModule]
})
export class BackgroundsModule {
}
