import { Module } from '@nestjs/common'
import { BackgroundsModule } from '../backgrounds'
import { UploadsModule } from '../uploads'
import { UserModule } from '../users'
import { M1cr0blogController } from './controller'

@Module({
    controllers: [M1cr0blogController],
    imports: [
        UserModule,
        UploadsModule,
        BackgroundsModule
    ]
})
export class M1cr0blogModule {}
