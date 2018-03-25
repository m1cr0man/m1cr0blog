import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadController } from './controller'
import { UploadService } from './service'
import { Upload } from './entity'

@Module({
    imports: [TypeOrmModule.forFeature([Upload])],
    controllers: [UploadController],
    components: [UploadService],
    exports: [UploadService]
})
export class UploadModule {}
