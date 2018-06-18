import { Module } from '@nestjs/common'
import { BackgroundsModule } from '../backgrounds'
import { BlogsModule } from '../blogs'
import { UploadsModule } from '../uploads'
import { UserModule } from '../users'
import { M1cr0blogController } from './controller'


@Module({
    controllers: [M1cr0blogController],
    imports: [
        UserModule,
        UploadsModule,
        BackgroundsModule,
        BlogsModule
    ]
})
export class M1cr0blogModule {}
