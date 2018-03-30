import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { M1cr0blogController } from './controller'
import { UploadModule } from '../uploader/module'
import { UserModule } from '../users/module'
import { dbConfig } from '../../config'

@Module({
    controllers: [M1cr0blogController],
    imports: [
        UserModule,
        UploadModule,
        TypeOrmModule.forRoot(dbConfig)
    ]
})
export class M1cr0blogModule {}
