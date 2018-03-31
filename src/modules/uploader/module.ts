import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadController } from './controller'
import { UploadService } from './service'
import { Upload } from './entity'
import { AuthMiddleware } from '../../auth.middleware'
import { UserModule } from '../users/module'

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([Upload])],
    controllers: [UploadController],
    components: [UploadService],
    exports: [UploadService]
})
export class UploadModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware)
        .with('uploads')
        .forRoutes(
            { path: 'api/v1/uploads', method: RequestMethod.GET },
            { path: 'api/v1/uploads', method: RequestMethod.POST },
            { path: 'api/v1/uploads/.*', method: RequestMethod.DELETE },
        )
    }
}
