import { Module } from '@nestjs/common'
import { M1cr0blogController } from './controller'
import { UserModule } from '../users/module'
import { UploadsModule } from '../uploads/module'
import { BackgroundsModule } from '../backgrounds/module'

@Module({
    controllers: [M1cr0blogController],
    imports: [
        UserModule,
        UploadsModule,
        BackgroundsModule
    ]
})
export class M1cr0blogModule {}
