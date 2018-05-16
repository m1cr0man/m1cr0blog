import { Module } from '@nestjs/common'
import { M1cr0blogController } from './controller'
import { UserModule } from '../users/module'

@Module({
    controllers: [M1cr0blogController],
    imports: [
        UserModule
    ]
})
export class M1cr0blogModule {}
