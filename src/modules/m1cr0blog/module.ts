import { Module } from '@nestjs/common'
import { M1cr0blogController } from './controller'
import { UploadModule } from '../uploader/module'

@Module({
    controllers: [M1cr0blogController],
    imports: [UploadModule]
})
export class M1cr0blogModule {}
