import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadController } from './controller'
import { Upload } from './entity'

@Module({
    imports: [TypeOrmModule.forFeature([Upload])],
    controllers: [UploadController]
})
export class UploadModule {}

