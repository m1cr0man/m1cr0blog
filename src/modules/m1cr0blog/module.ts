import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { M1cr0blogController } from './controller'
import { UploadModule } from '../uploader/module'
import { dbConfig } from '../../config'

console.log(dbConfig)
@Module({
    controllers: [M1cr0blogController],
    imports: [
        UploadModule,
        TypeOrmModule.forRoot(dbConfig)
    ]
})
export class M1cr0blogModule {}
