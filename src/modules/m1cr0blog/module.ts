import { Module } from '@nestjs/common'
import { M1cr0blogController } from './controller'

@Module({
    controllers: [M1cr0blogController]
})
export class M1cr0blogModule {}
