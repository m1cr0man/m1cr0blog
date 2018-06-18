import { Module } from '@nestjs/common'
import { UserModule } from '../users'
import { BlogsController } from './controller'
import { BlogsRepository } from './repository'
import { BlogsService } from './service'


@Module({
    controllers: [BlogsController],
    providers: [BlogsService, BlogsRepository],
    imports: [UserModule],
    exports: [BlogsService, BlogsRepository]
})
export class BlogsModule {
}
