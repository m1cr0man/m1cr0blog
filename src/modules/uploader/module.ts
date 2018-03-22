import { Module } from '@nestjs/common'
import { UploadController } from './controller'

@Module({
    controllers: [UploadController]
})
export class UploadModule {}
